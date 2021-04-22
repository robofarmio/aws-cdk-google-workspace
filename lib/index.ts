import { Construct, Duration } from "@aws-cdk/core";
import { IHostedZone, MxRecord, TxtRecord } from "@aws-cdk/aws-route53";


export interface GoogleWorkspaceProps {
  // The hosted zone to set up for Google Workspace
  readonly hostedZone: IHostedZone;
  // The domain name to set up for Google Workspace (default: zone root)
  readonly recordName?: string;
  // The verification code to set up for Google Workspace
  readonly verificationCode: string;
  // If this stack should manage the SPF record for this domain.
  // Because there can only be one SPF record per domain,
  // you might want to manage it externally yourself.
  // If not provided, defaults to true (i.e. sets SPF).
  readonly manageSpfRecord?: boolean;
}


export class GoogleWorkspace extends Construct {
  constructor(scope: Construct, id: string, props: GoogleWorkspaceProps) {
    super(scope, id);

    // https://support.google.com/a/answer/140034

    new MxRecord(this, "MX", {
      values: [
        { hostName: "ASPMX.L.GOOGLE.COM", priority: 1 },
        { hostName: "ALT1.ASPMX.L.GOOGLE.COM", priority: 5 },
        { hostName: "ALT2.ASPMX.L.GOOGLE.COM", priority: 5 },
        { hostName: "ALT3.ASPMX.L.GOOGLE.COM", priority: 10 },
        { hostName: "ALT4.ASPMX.L.GOOGLE.COM", priority: 10 },
      ],
      zone: props.hostedZone,
      recordName: props.recordName,
      ttl: Duration.hours(24),
    });

    // https://support.google.com/a/answer/183895

    const values = [
      props.verificationCode,
    ];

    if (props.manageSpfRecord === undefined || props.manageSpfRecord) {
      values.push("v=spf1 include:_spf.google.com ~all");
    }

    new TxtRecord(this, "TXT", {
      values: values,
      zone: props.hostedZone,
      recordName: props.recordName,
      ttl: Duration.hours(24),
    });
  }
}
