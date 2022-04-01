import { Migration } from "@mikro-orm/migrations";

export class Migration20220401084449 extends Migration {

  async up(): Promise<void> {
    this.addSql("create table \"score\" (\"id\" serial primary key, \"created_at\" timestamptz(0) not null, \"updated_at\" timestamptz(0) not null, \"player\" varchar(255) not null, \"score\" int not null);");
    this.addSql("create index \"score_player_index\" on \"score\" (\"player\");");
    this.addSql("create index \"score_score_index\" on \"score\" (\"score\");");
  }

}
