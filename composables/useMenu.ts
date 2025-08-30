// ~/composables/useMenu.ts
import { computed } from "vue"
import { useI18n } from "vue-i18n"

export function useMenu() {
  const { t } = useI18n()

  const menu = computed(() => [
    {
      key: "ua-pl",
      name: t("ua-pl.name"),
      borders: [
        {
          key: "krakovets",
          coords: { lat: 49.290496, lon: 25.695826 },
          labelfun: () => t("ua-pl.borders['krakovets'].label"),
          label: t("ua-pl.borders.krakovets.label"),
          full: t("ua-pl.borders.krakovets.full"),
        },
        {
          key: "rava-ruska",
          coords: { lat: 50.264339, lon: 23.598819 },
          labelfun: () => t("ua-pl.borders['rava-ruska'].label"),
          label: t("ua-pl.borders.rava-ruska.label"),
          full: t("ua-pl.borders.rava-ruska.full"),
        },
        {
          key: "shehyni",
          labelfun: () => t("ua-pl.borders['shehyni'].label"),
          label: t("ua-pl.borders.shehyni.label"),
          full: t("ua-pl.borders.shehyni.full"),
        },
        {
          key: "ustyluh",

          labelfun: () => t("ua-pl.borders['ustyluh'].label"),
          label: t("ua-pl.borders.ustyluh.label"),
          full: t("ua-pl.borders.ustyluh.full"),
        },
        {
          key: "yahodyn",
          labelfun: () => t("ua-pl.borders['yahodyn'].label"),
          label: t("ua-pl.borders.yahodyn.label"),
          full: t("ua-pl.borders.yahodyn.full"),
        },
        {
          key: "hrushiv",
          labelfun: () => t("ua-pl.borders['hrushiv'].label"),
          label: t("ua-pl.borders.hrushiv.label"),
          full: t("ua-pl.borders.hrushiv.full"),
        },
        {
          key: "smilnytsia",
          labelfun: () => t("ua-pl.borders['smilnytsia'].label"),
          label: t("ua-pl.borders.smilnytsia.label"),
          full: t("ua-pl.borders.smilnytsia.full"),
        },
      ],
    },
    {
      key: "pl-ua",
      name: t("pl-ua.name"),
      borders: [
        {
          key: "korchova",
          coords: { lat: 49.295599, lon: 25.692518 },
          labelfun: () => t("pl-ua.borders['korchova'].label"),
          label: t("pl-ua.borders.korchova.label"),
          full: t("pl-ua.borders.korchova.full"),
        },
        {
          key: "grebenne",
          coords: { lat: 50.279398, lon: 23.583456 },
          labelfun: () => t("pl-ua.borders['grebenne'].label"),
          label: t("pl-ua.borders.grebenne.label"),
          full: t("pl-ua.borders.grebenne.full"),
        },
        {
          key: "medyka",

          labelfun: () => t("pl-ua.borders['medyka'].label"),
          label: t("pl-ua.borders.medyka.label"),
          full: t("pl-ua.borders.medyka.full"),
        },
        {
          key: "zosin",
          labelfun: () => t("pl-ua.borders['zosin'].label"),
          label: t("pl-ua.borders.zosin.label"),
          full: t("pl-ua.borders.zosin.full"),
        },
        {
          key: "dorohusk",
          labelfun: () => t("pl-ua.borders['dorohusk'].label"),
          label: t("pl-ua.borders.dorohusk.label"),
          full: t("pl-ua.borders.dorohusk.full"),
        },
        {
          key: "budomierz",
          labelfun: () => t("pl-ua.borders['budomierz'].label"),
          label: t("pl-ua.borders.budomierz.label"),
          full: t("pl-ua.borders.budomierz.full"),
        },
        {
          key: "kroscienko",
          labelfun: () => t("pl-ua.borders['kroscienko'].label"),
          label: t("pl-ua.borders.kroscienko.label"),
          full: t("pl-ua.borders.kroscienko.full"),
        },
      ],
    },
    {
      key: "ua-sk",
      name: t("ua-sk.name"),
      borders: [
        {
          key: "uzhhorod",
          labelfun: () => t("ua-sk.borders['uzhhorod'].label"),
          label: t("ua-sk.borders.uzhhorod.label"),
          full: t("ua-sk.borders.uzhhorod.full"),
        },
        {
          key: "mali-selmentsi",
          labelfun: () => t("ua-sk.borders['mali-selmentsi'].label"),
          label: t("ua-sk.borders.mali-selmentsi.label"),
          full: t("ua-sk.borders.mali-selmentsi.full"),
        },
      ],
    },
    {
      key: "sk-ua",
      name: t("sk-ua.name"),
      borders: [
        {
          key: "vysne-nemecke",
          labelfun: () => t("sk-ua.borders['vysne-nemecke'].label"),
          label: t("sk-ua.borders.vysne-nemecke.label"),
          full: t("sk-ua.borders.vysne-nemecke.full"),
        },
        {
          key: "velke-selmentsi",
          labelfun: () => t("sk-ua.borders['velke-selmentsi'].label"),
          label: t("sk-ua.borders.velke-selmentsi.label"),
          full: t("sk-ua.borders.velke-selmentsi.full"),
        },
      ],
    },
    {
      key: "ua-hu",
      name: t("ua-hu.name"),
      borders: [
        {
          key: "chop",
          labelfun: () => t("ua-hu.borders['chop'].label"),
          label: t("ua-hu.borders.chop.label"),
          full: t("ua-hu.borders.chop.full"),
        },
        {
          key: "luzhanka",
          labelfun: () => t("ua-hu.borders['luzhanka'].label"),
          label: t("ua-hu.borders.luzhanka.label"),
          full: t("ua-hu.borders.luzhanka.full"),
        },
        {
          key: "dzvinkove",
          labelfun: () => t("ua-hu.borders['dzvinkove'].label"),
          label: t("ua-hu.borders.dzvinkove.label"),
          full: t("ua-hu.borders.dzvinkove.full"),
        },
      ],
    },
    {
      key: "hu-ua",
      name: t("hu-ua.name"),
      borders: [
        {
          key: "zahony",
          labelfun: () => t("hu-ua.borders['zahony'].label"),
          label: t("hu-ua.borders.zahony.label"),
          full: t("hu-ua.borders.zahony.full"),
        },
        {
          key: "beregdaroc",
          labelfun: () => t("hu-ua.borders['beregdaroc'].label"),
          label: t("hu-ua.borders.beregdaroc.label"),
          full: t("hu-ua.borders.beregdaroc.full"),
        },
        {
          key: "astei",
          labelfun: () => t("hu-ua.borders['astei'].label"),
          label: t("hu-ua.borders.astei.label"),
          full: t("hu-ua.borders.astei.full"),
        },
      ],
    },
    {
      key: "ua-ro",
      name: t("ua-ro.name"),
      borders: [
        {
          key: "porubne",
          labelfun: () => t("ua-ro.borders['porubne'].label"),
          label: t("ua-ro.borders.porubne.label"),
          full: t("ua-ro.borders.porubne.full"),
        },
        {
          key: "dyakove",
          labelfun: () => t("ua-ro.borders['dyakove'].label"),
          label: t("ua-ro.borders.dyakove.label"),
          full: t("ua-ro.borders.dyakove.full"),
        },
        {
          key: "solotvyno",
          labelfun: () => t("ua-ro.borders['solotvyno'].label"),
          label: t("ua-ro.borders.solotvyno.label"),
          full: t("ua-ro.borders.solotvyno.full"),
        },
      ],
    },
    {
      key: "ro-ua",
      name: t("ro-ua.name"),
      borders: [
        {
          key: "siret",
          labelfun: () => t("ro-ua.borders['siret'].label"),
          label: t("ro-ua.borders.siret.label"),
          full: t("ro-ua.borders.siret.full"),
        },
        {
          key: "halmeu",
          labelfun: () => t("ro-ua.borders['halmeu'].label"),
          label: t("ro-ua.borders.halmeu.label"),
          full: t("ro-ua.borders.halmeu.full"),
        },
        {
          key: "sighet",
          labelfun: () => t("ro-ua.borders['sighet'].label"),
          label: t("ro-ua.borders.sighet.label"),
          full: t("ro-ua.borders.sighet.full"),
        },
      ],
    },
    {
      key: "ua-md",
      name: t("ua-md.name"),
      borders: [
        {
          key: "mohyli-podilskyi",
          labelfun: () => t("ua-md.borders['mohyliv'].label"),
          label: t("ua-md.borders.mohyliv.label"),
          full: t("ua-md.borders.mohyliv.full"),
        },
        {
          key: "mamalyha",
          labelfun: () => t("ua-md.borders['mamalyga'].label"),
          label: t("ua-md.borders.mamalyga.label"),
          full: t("ua-md.borders.mamalyga.full"),
        },
        {
          key: "roshoshany",
          labelfun: () => t("ua-md.borders['rosozhany'].label"),
          label: t("ua-md.borders.rosozhany.label"),
          full: t("ua-md.borders.rosozhany.full"),
        },
      ],
    },
    {
      key: "md-ua",
      name: t("md-ua.name"),
      borders: [
        {
          key: "otaci",
          labelfun: () => t("md-ua.borders['otach'].label"),
          label: t("md-ua.borders.otach.label"),
          full: t("md-ua.borders.otach.full"),
        },
        {
          key: "criva",
          labelfun: () => t("md-ua.borders['kryva'].label"),
          label: t("md-ua.borders.kryva.label"),
          full: t("md-ua.borders.kryva.full"),
        },
        {
          key: "briceni",
          labelfun: () => t("md-ua.borders['brycheny'].label"),
          label: t("md-ua.borders.brycheny.label"),
          full: t("md-ua.borders.brycheny.full"),
        },
      ],
    },
  ])

  return { menu }
}
