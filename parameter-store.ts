import {
  SSMClient,
  GetParameterCommand,
  GetParametersCommand,
} from "@aws-sdk/client-ssm";
const client = new SSMClient({ region: "us-east-1" });

export async function getParameter(name: string) {
  const input = { Name: "", WithDecryption: false };
  const command = new GetParameterCommand(input);
  return await client.send(command);
}

export async function getParameters(names: string[]) {
  const input = { Names: names, WithDecryption: false };
  const command = new GetParametersCommand(input);
  return await client.send(command);
}
