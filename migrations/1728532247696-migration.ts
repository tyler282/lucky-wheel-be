import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1728532247696 implements MigrationInterface {
    name = 'Migration1728532247696'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "totalPoints" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "totalPoints" DROP DEFAULT`);
    }

}
