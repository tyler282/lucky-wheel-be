import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1727942804964 implements MigrationInterface {
    name = 'Migration1727942804964'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "redeem_point_history" RENAME COLUMN "reedemDate" TO "redeemDate"`);
        await queryRunner.query(`ALTER TABLE "item" RENAME COLUMN "catergoryId" TO "categoryId"`);
        await queryRunner.query(`ALTER TABLE "redeem_point_history" ADD CONSTRAINT "FK_8b5a1a70fc19cfafc2e8b0e4c63" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "spin_history" ADD CONSTRAINT "FK_b09b75de952cbc9a979825d6a13" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "spin_history" ADD CONSTRAINT "FK_988aeb7cbcbbca6b96bcacbbce9" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "spin_history" DROP CONSTRAINT "FK_988aeb7cbcbbca6b96bcacbbce9"`);
        await queryRunner.query(`ALTER TABLE "spin_history" DROP CONSTRAINT "FK_b09b75de952cbc9a979825d6a13"`);
        await queryRunner.query(`ALTER TABLE "redeem_point_history" DROP CONSTRAINT "FK_8b5a1a70fc19cfafc2e8b0e4c63"`);
        await queryRunner.query(`ALTER TABLE "item" RENAME COLUMN "categoryId" TO "catergoryId"`);
        await queryRunner.query(`ALTER TABLE "redeem_point_history" RENAME COLUMN "redeemDate" TO "reedemDate"`);
    }

}
