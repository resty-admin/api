import type { User } from "typegram/manage";

import type { UserRoleEnum } from "../../enums";

export type ITelegramUser = User & { role: UserRoleEnum };
