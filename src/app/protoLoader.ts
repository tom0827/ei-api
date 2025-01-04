import path from "path";
import protobuf from "protobufjs";

const PROTO_PATH = path.resolve(process.cwd(), "src/proto/ei.proto");

// Parse the .proto file once at startup
const rootPromise = protobuf
  .load(PROTO_PATH)
  .then((root) => {
    console.log("Successfully loaded ei.proto");
    return root;
  })
  .catch((err) => {
    console.error("Error loading ei.proto:", err);
    throw err;
  });

/**
 * A helper function to retrieve the loaded protobuf Root object.
 * Returns the same promise each time, so it's loaded exactly once.
 */
export async function getProtoRoot(): Promise<protobuf.Root> {
  return rootPromise;
}
