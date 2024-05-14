import pg from "pg-promise";
import { IConnectionParameters } from "pg-promise/typescript/pg-subset";
import * as dotenv from "dotenv";

export default class Database {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dbCM: any;
  dbAGW: any;

  connectionCM: IConnectionParameters;
  connectionAGW: IConnectionParameters;

  pgp = pg();

  private static instance: Database;

  private constructor() {
    // TODO Variables de ambiente
    dotenv.config();
    this.connectionCM = {
      host: process.env.POSTGRES_CM_HOST,
      port: process.env.POSTGRES_CM_PORT ? parseInt(process.env.POSTGRES_CM_PORT, 10) : 5432,
      database: process.env.POSTGRES_CM_DATABASE,
      user: process.env.POSTGRES_CM_USER,
      password: process.env.POSTGRES_CM_PASS,
      lock_timeout: 1000,
    };
    this.connectionAGW = {
      host: process.env.POSTGRES_AGW_HOST,
      port: process.env.POSTGRES_AGW_PORT ? parseInt(process.env.POSTGRES_AGW_PORT, 10) : 5432,
      database: process.env.POSTGRES_AGW_DATABASE,
      user: process.env.POSTGRES_AGW_USER,
      password: process.env.POSTGRES_AGW_PASS,
      lock_timeout: 1000,
    };
    this.dbCM = this.pgp(this.connectionCM);
    this.dbAGW = this.pgp(this.connectionAGW);
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async getCodigoRemision(referencia: string) {
    try {
      const query = `select ar.codigo_remision from agw_remisiones ar where referencia = ${referencia}`;
      const result = await this.dbAGW.any(query);
      console.log("Resultado de la consulta: ", result);
      return result;
    } catch (error) {
      console.error("Error fetching eventos:", error);
      throw error;
    }
  }

  async getIdRemision(codigoRemision: string) {
    try {
      const query = `select id_remision from agw_remisiones where codigo_remision = ${codigoRemision}`;
      const result = await this.dbAGW.any(query);
      console.log("Resultado de la consulta: ", result);
      return result;
    } catch (error) {
      console.error("Error fetching eventos:", error);
      throw error;
    }
  }

  async getNivelServicio(idRemision: number) {
    try {
      const query = `select nivel_servicio from agw_remisiones_niveles_servicio a where a.id_remision = ${idRemision}`;
      const result = await this.dbAGW.any(query);
      console.log("Resultado de la consulta: ", result);
      return result;
    } catch (error) {
      console.error("Error fetching eventos:", error);
      throw error;
    }
  }

  async getNivelServicioByReferenciaYReferenciaDetalle(referencia: string, referenciaDetalle: string[]) {
    try {
      const query = `SELECT a.codigo_remision FROM agw_remisiones a JOIN agw_detalle b ON a.id_remision = b.id_remision WHERE a.referencia = ${referencia} and b.referencia = ${referenciaDetalle}`;
      const result = await this.dbAGW.any(query);
      console.log("Resultado de la consulta: ", result);
      return result;
    } catch (error) {
      console.error("Error fetching eventos:", error);
      throw error;
    }
  }

  async closeConnection(): Promise<void> {
    this.pgp.end();
  }
}
