/* eslint-disable @typescript-eslint/no-explicit-any */
import { getProtoRoot } from "@/app/protoLoader";
import {
  decodeResponse,
  encodePayloadToBase64,
  fetchData,
  validatePayload,
} from "@/app/utils";

export async function POST(request: Request): Promise<Response> {
  const { eid } = await request.json();

  if (!eid) {
    return Response.json(
      { error: "Missing required parameter 'eid'" },
      { status: 400 }
    );
  }

  try {
    // Load the protobuf root
    const root: protobuf.Root = await getProtoRoot();
    const EggIncFirstContactRequest = root.lookupType(
      "ei.EggIncFirstContactRequest"
    );
    const EggIncFirstContactResponse = root.lookupType(
      "ei.EggIncFirstContactResponse"
    );

    // Create and validate the payload
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
    const error = validatePayload(EggIncFirstContactRequest, payload);

    if (error) {
      return error;
    }

    // Encode the payload to base64
    const base64Data = encodePayloadToBase64(
      EggIncFirstContactRequest,
      payload
    );

    // Fetch the data from the EI server
    const responseText = await fetchData(base64Data);

    // Decode the response
    const responseMessage = decodeResponse(
      EggIncFirstContactResponse,
      responseText
    ) as any;

    console.log(responseMessage.backup)

    const mysticalEggs = {
      "soulEggs": responseMessage.backup.game.soulEggsD,
      "prophecyEggs": responseMessage.backup.game.eggsOfProphecy.low,
      "prestiges": responseMessage.backup.stats.numPrestiges.low,
    }
    
    return Response.json(mysticalEggs, { status: 200 });
  } catch (error: any) {
    console.log(error.message);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
