import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import en from '@/assets/locale/lang/en'
import zh from '@/assets/locale/lang/zh'
import ElementLocale from 'element-ui/lib/locale'

Vue.use(VueI18n)

const messages = {
  en: {
    ...enLocale,
    ...en
  },
  zh: {
    ...zhLocale,
    ...zh
  }
}
// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: localStorage.getItem('language') || 'en-US', // set locale
  messages // set locale messages
})

ElementLocale.i18n((key, value) => i18n.t(key, value))

export default i18n
