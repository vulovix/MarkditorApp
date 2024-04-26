import usePreferenceStore, { prefActions, PrefThemeMode } from "@/store/preference";
import { Select } from "@radix-ui/themes";
import { t } from "i18next";
import { SettingItem } from "./SettingItem";
import { supportedLanguages } from "@/i18n/i18n";



export const SelectLanguage = () => {
  const languageCode = usePreferenceStore(s => s.languageCode)

  const languageSelectItems = supportedLanguages.map((lang) => {
    return <Select.Item key={lang.code} value={lang.code}>{lang.label}</Select.Item>
  })

  return (
    <SettingItem title={t("settings.language.title") + " 🌏"} subtitle=""
      trailing={
        <Select.Root value={languageCode}
          onValueChange={(code) => prefActions.setLanguageCode(code)}>
          <Select.Trigger className='w-[120px]' />
          <Select.Content>
            {languageSelectItems}
          </Select.Content>
        </Select.Root>
      }
    />
  )
}