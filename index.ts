import pg from "pg-ninja";

export { pg as PG_Ninja };

export default function postgresLibrary(lib: any, db: any): any {
  const result: any = {};

  for (const key in lib) {
    if (lib.hasOwnProperty(key)) {
      if (typeof lib[key] === "string") {
        result[key] = {
          value: lib[key],
          query: async function (binds: any[]): Promise<any> {
            const response = await db.query(this.value, binds); // Await the promise
            return response;
          },
        };
      } else if (Array.isArray(lib[key])) {
        result[key] = {
          value: lib[key],
          transaction: async function (binds: any[]): Promise<any> {
            const response = await db.transaction(this.value, binds); //Await the promise
            return response;
          },
        };
      } else if (typeof lib[key] === "object") {
        result[key] = postgresLibrary(lib[key], db); // Recursive call
      }
    }
  }

  result.end = async () => { //Make end async to handle potential promise
    await db.end();
  };

  return result;
}
