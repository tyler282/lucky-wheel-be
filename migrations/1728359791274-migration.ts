import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1728359791274 implements MigrationInterface {
    name = 'Migration1728359791274'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item" ADD "order" integer`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "totalPoints" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "totalPoints" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "order"`);
    }

}
