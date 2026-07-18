import { buildGraph } from "./domain/graph";
import { ingest } from "./domain/ingestion";
import { findConnections } from "./domain/query";
import type { Connection, Entity } from "./domain/types";
import { DATA_DIR, findEntity, loadRecords } from "./demo";

interface Options {
  start?: string;
  hops: number;
  showEntityDetails: boolean;
}

function parseOptions(argv: string[]): Options {
  const options: Options = { hops: 2, showEntityDetails: false };

  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];

    if (flag === "--start") {
      options.start = argv[index + 1];
      index += 1;
    } else if (flag === "--hops") {
      const value = Number(argv[index + 1]);
      options.hops = Number.isFinite(value) ? value : options.hops;
      index += 1;
    } else if (flag === "--show-entity-details") {
      options.showEntityDetails = true;
    }
  }

  return options;
}

function printEntities(entities: Entity[], showDetails: boolean): void {
  console.log(`Resolved ${entities.length} entities from ${DATA_DIR}.`);

  if (!showDetails) {
    console.log("");
    return;
  }

  for (const entity of entities) {
    const document = entity.document ? `  document=${entity.document}` : "";
    console.log(`  ${entity.id}  ${entity.name}${document}`);
  }

  console.log("");
}

function printConnections(origin: Entity, hops: number, connections: Connection[]): void {
  console.log(`Connections from "${origin.name}" within ${hops} hops:`);

  if (connections.length === 0) {
    console.log("  (no connections found)");
    return;
  }

  for (const connection of connections) {
    const path = connection.path.map((entity) => entity.name).join(" -> ");
    const via = connection.relationships.map((relationship) => relationship.relationshipType).join(" -> ");

    console.log(`  ${connection.hops} hops: ${connection.entity.name}`);
    console.log(`    path: ${path}`);
    console.log(`    via:  ${via}`);
  }
}

function main(): void {
  const options = parseOptions(process.argv.slice(2));
  const { entities, relationships } = ingest(loadRecords(DATA_DIR));
  const graph = buildGraph(entities, relationships);

  printEntities(entities, options.showEntityDetails);

  const reference = options.start ?? entities[0]?.id ?? "";
  const origin = findEntity(entities, reference);

  if (!origin) {
    console.error(`Entity not found for reference: "${reference}"`);
    process.exitCode = 1;
    return;
  }

  printConnections(origin, options.hops, findConnections(graph, origin.id, options.hops));
}

main();
