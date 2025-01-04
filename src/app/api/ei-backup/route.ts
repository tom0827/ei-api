/* eslint-disable @typescript-eslint/no-explicit-any */
import { getProtoRoot } from "@/app/protoLoader";

const ENDPOINT = "https://ctx-dot-auxbrainhome.appspot.com";

export async function POST(request: Request) {
  const { eid } = await request.json();

  if (!eid) {
    return Response.json({ error: "Missing required parameter 'eid'" }, { status: 400 });
  }

  const root: protobuf.Root = await getProtoRoot();

  const EggIncFirstContactRequest = root.lookupType(
    "ei.EggIncFirstContactRequest"
  );
  const EggIncFirstContactResponse = root.lookupType(
    "ei.EggIncFirstContactResponse"
  );

  const payload = {
    rinfo: {
      eiUserId: eid,
      clientVersion: 69,
      version: "1.34",
      build: "111299",
    },
    eiUserId: eid,
    clientVersion: 69,
  };

  const error = EggIncFirstContactRequest.verify(payload);
  if (error) throw Error(error);

  const message = EggIncFirstContactRequest.create(payload);
  const buffer = EggIncFirstContactRequest.encode(message).finish();
  const base64Data = btoa(String.fromCharCode(...buffer));

  const response = await fetch(ENDPOINT + "/ei/bot_first_contact", {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ data: base64Data }),
  });

  if (!response.ok)
    throw new Error(`Network response was not ok: ${response.statusText}`);
  const responseText = await response.text();

  const binaryResponse = Uint8Array.from(atob(responseText), (c) =>
    c.charCodeAt(0)
  );
  const responseMessage = EggIncFirstContactResponse.decode(binaryResponse);

  if ((responseMessage as any).errorCode || (responseMessage as any).errorMessage) {
    throw Error((responseMessage as any).errorMessage);
  }

  return Response.json({ backup: (responseMessage as any).backup }, { status: 200 });
}
