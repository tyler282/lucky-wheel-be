import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1727771845731 implements MigrationInterface {
    name = 'Migration1727771845731'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "password" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_638bac731294171648258260ff2" UNIQUE ("password")`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_638bac731294171648258260ff2"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
    }

}
