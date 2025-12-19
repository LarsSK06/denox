import AppColorScheme from "@/types/common/AppColorScheme";
import AppLang from "@/types/common/AppLang";

type Settings_GET = {
    allowAnimations: boolean | null;
    capitalizeDomainNames: boolean | null;
    colorScheme: AppColorScheme | null;
    language: AppLang | null;
    showRecordIds: boolean | null;
};

export default Settings_GET;