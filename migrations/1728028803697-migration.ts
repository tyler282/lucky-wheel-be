import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1728028803697 implements MigrationInterface {
    name = 'Migration1728028803697'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item" ADD "weight" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "weight"`);
    }

}
