import * as dotenv from 'dotenv';
import {Pool, PoolConfig} from 'pg';
// @ts-ignore
import pgPromise from 'pg-promise';

export default class Database {
  private static instance: Database;
  private dbCM: Pool;
  private dbAGW: Pool;
  private pgp: pgPromise.IMain;

  constructor() { //? Variables de ambiente
    dotenv.config();
    const connectionAGW: PoolConfig = {
      host: process.env.POSTGRES_AGW_HOST,
      port: process.env.POSTGRES_AGW_PORT ? parseInt(process.env.POSTGRES_AGW_PORT, 10) : 5432,
      database: process.env.POSTGRES_AGW_DATABASE,
      user: process.env.POSTGRES_AGW_USER,
      password: process.env.POSTGRES_AGW_PASS
    };
    const connectionCM: PoolConfig = {
      host: process.env.POSTGRES_CM_HOST,
      port: process.env.POSTGRES_CM_PORT ? parseInt(process.env.POSTGRES_CM_PORT, 10) : 5432,
      database: process.env.POSTGRES_CM_DATABASE,
      user: process.env.POSTGRES_CM_USER,
      password: process.env.POSTGRES_CM_PASS
    };
    this.dbAGW = new Pool(connectionAGW);
    this.dbCM = new Pool(connectionCM);
    this.pgp = pgPromise();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async consultaEliminacionCM(codigoRemision: string) {
    try {
      const consulta1 = await this.dbCM.query('select anulado, valor_total, * from recaudos r where codigo_remision = $1', [codigoRemision]);
      const consulta2 = await this.dbCM.query('select codigo_nivel_servicio, nivel_servicio, recaudo,* from generacion_rotulos where codigo_remision = $1', [codigoRemision]);
      const consulta3 = await this.dbCM.query('select nivel_servicio, * from remesas_niveles_servicio where codigo_remision = $1', [codigoRemision]);
      return {consulta1, consulta2, consulta3};
    } catch (error) {
      console.log('Error en la consulta de eliminacion de CM:', error);
      throw error;
    }
  }

  async consultaModificacionCM(codigoRemision: string) {
    try {
      const consulta1 = await this.dbCM.query('select anulado, valor_total, * from recaudos r where codigo_remision = $1', [codigoRemision]);
      const consulta2 = await this.dbCM.query('select nivel_servicio, * from remesas_niveles_servicio where codigo_remision = $1', [codigoRemision]);
      return {consulta1, consulta2};
    } catch (error) {
      console.log('Error en la consulta de modificacion de CM:', error);
      throw error;
    }
  }

  async consultaAgregarCM(codigoRemision: string) {
    try {
      const consulta1 = await this.dbCM.query('select anulado, valor_total from recaudos r where codigo_remision = $1', [codigoRemision]);
      const consulta2 = await this.dbCM.query('select codigo_nivel_servicio, nivel_servicio, recaudo from generacion_rotulos where codigo_remision = $1', [codigoRemision]);
      const consulta3 = await this.dbCM.query('select nivel_servicio from remesas_niveles_servicio where codigo_remision = $1', [codigoRemision]);
      return {consulta1, consulta2, consulta3};
    } catch (error) {
      console.log('Error en la consulta de creacion de CM:', error);
      throw error;
    }
  }

  async getCodigoRemision(referencia: string) { //? obtener el codigo de remision de una referencia
    try {
      const codigoRemision = await this.dbAGW.query('select ar.codigo_remision from agw_remisiones ar  where referencia = $1', [referencia]);
      return codigoRemision;
    } catch (error) {
      console.error('Error fetching codigo remision:', error);
      throw error;
    }
  }

  async getIdRemision(codigoRemision: string) { //? obtener el id de remision de un codigo de remision
    try {
      const idRemision = await this.dbAGW.query('select id_remision from agw_remisiones where codigo_remision = $1;', [codigoRemision]);
      return idRemision;
    } catch (error) {
      console.error('Error fetching id remision:', error);
      throw error;
    }
  }

  async getNivelServicio(idRemision: number) { //? obtener el nivel de servicio de una remision
    try {
      const nivelServicio = await this.dbAGW.query('select nivel_servicio from agw_remisiones_niveles_servicio a where a.id_remision = $1', [idRemision]);
      return nivelServicio;
    } catch (error) {
      console.error('Error fetching nivel servicio:', error);
      throw error;
    }
  }

  async getNivelServicioByReferenciaYReferenciaDetalle(referencia: string, referenciaDetalle: string[]) { //? obtener el codigo remision de una remision por referencia y referencia de detalle
    try {
      const ref = await this.dbAGW.query(`SELECT a.codigo_remision FROM agw_remisiones a JOIN agw_detalle b ON a.id_remision = b.id_remision WHERE a.referencia = $1 and b.referencia = $2;`, [referencia, referenciaDetalle]);
      return ref;
    } catch (error) {
      console.error('Error fetching nCodigo remision:', error);
      throw error;
    }
  }

  async closeConnection(): Promise<void> {
    this.pgp.end();
  }
}

