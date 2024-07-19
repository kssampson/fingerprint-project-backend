import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnToName1721366107092 implements MigrationInterface {
    name = 'AddColumnToName1721366107092'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "name" ADD "email" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "name" DROP COLUMN "email"`);
    }

}
