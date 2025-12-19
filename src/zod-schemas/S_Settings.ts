import * as z from "zod";

import AppColorScheme from "@/types/common/AppColorScheme";
import AppLang from "@/types/common/AppLang";

const S_Settings = z.object({
    allowAnimations:            z.boolean().nullable().optional(),
    capitalizeDomainNames:      z.boolean().nullable().optional(),
    colorScheme:                z.literal(Object.values(AppColorScheme)).nullable().optional(),
    language:                   z.literal(Object.values(AppLang)).nullable().optional(),
    showRecordIds:              z.boolean().nullable().optional()
});

export default S_Settings;