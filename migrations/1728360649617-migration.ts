import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1728360649617 implements MigrationInterface {
    name = 'Migration1728360649617'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "order" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "order" DROP NOT NULL`);
    }

}
