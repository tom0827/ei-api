const ENDPOINT = "https://ctx-dot-auxbrainhome.appspot.com";

export const getClientVersionPayload = (eid: string) => {
  return {
    rinfo: {
      eiUserId: eid,
      clientVersion: 69,
      version: "1.34",
      build: "111299",
    },
    eiUserId: eid,
    clientVersion: 69,
  };
};

export const validatePayload = (
  type: protobuf.Type,
  payload: object
): Response | null => {
  const error = type.verify(payload);
  if (error) {
    return Response.json(`Payload validation failed: ${error}`, { status: 400 });
  }
  return null;
};

export const encodePayloadToBase64 = (
  type: protobuf.Type,
  payload: object
): string => {
  const message = type.create(payload);
  const buffer = type.encode(message).finish();
  return btoa(String.fromCharCode(...buffer));
};

export const fetchData = async (base64Data: string): Promise<string> => {
  const response = await fetch(`${ENDPOINT}/ei/bot_first_contact`, {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ data: base64Data }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch data from remote server: ${response.statusText}`);
  }

  return response.text();
};

export const decodeResponse = (
  type: protobuf.Type,
  responseText: string
): unknown => {
  const binaryResponse = Uint8Array.from(atob(responseText), (c) =>
    c.charCodeAt(0)
  );
  return type.decode(binaryResponse);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateResponse = (responseMessage: any): Response | null => {
  if (responseMessage.errorCode || responseMessage.errorMessage) {
    return Response.json(
      responseMessage.errorMessage || "Internal server error",
      { status: 500 }
    );
  }
  return null;
};
