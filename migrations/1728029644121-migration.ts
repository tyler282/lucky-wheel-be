import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1728029644121 implements MigrationInterface {
    name = 'Migration1728029644121'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item" ADD "weight" integer NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "weight"`);
    }

}
