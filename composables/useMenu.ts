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
          coords: { lat: 49.955555, lon: 23.136327 },
          labelfun: () => t("ua-pl.borders['krakovets'].label"),
          label: t("ua-pl.borders.krakovets.label"),
          full: t("ua-pl.borders.krakovets.full"),
        },
        {
          key: "rava-ruska",
          coords: { lat: 50.262676, lon: 23.600136 },
          labelfun: () => t("ua-pl.borders['rava-ruska'].label"),
          label: t("ua-pl.borders.rava-ruska.label"),
          full: t("ua-pl.borders.rava-ruska.full"),
        },
        {
          key: "shehyni",
          coords: { lat: 49.798919, lon: 22.964763 },
          labelfun: () => t("ua-pl.borders['shehyni'].label"),
          label: t("ua-pl.borders.shehyni.label"),
          full: t("ua-pl.borders.shehyni.full"),
        },
        {
          key: "ustyluh",
          coords: { lat: 50.857607, lon: 24.146778 },
          labelfun: () => t("ua-pl.borders['ustyluh'].label"),
          label: t("ua-pl.borders.ustyluh.label"),
          full: t("ua-pl.borders.ustyluh.full"),
        },
        {
          key: "yahodyn",
          coords: { lat: 51.194258, lon: 23.826965 },
          labelfun: () => t("ua-pl.borders['yahodyn'].label"),
          label: t("ua-pl.borders.yahodyn.label"),
          full: t("ua-pl.borders.yahodyn.full"),
        },
        {
          key: "hrushiv",
          coords: { lat: 50.090369, lon: 23.28814 },
          labelfun: () => t("ua-pl.borders['hrushiv'].label"),
          label: t("ua-pl.borders.hrushiv.label"),
          full: t("ua-pl.borders.hrushiv.full"),
        },
        {
          key: "smilnytsia",
          coords: { lat: 49.47875, lon: 22.714685 },
          labelfun: () => t("ua-pl.borders['smilnytsia'].label"),
          label: t("ua-pl.borders.smilnytsia.label"),
          full: t("ua-pl.borders.smilnytsia.full"),
        },
        {
          key: "uhryniv",
          coords: { lat: 50.574488, lon: 24.103964 },
          labelfun: () => t("ua-pl.borders['uhryniv'].label"),
          label: t("ua-pl.borders.uhryniv.label"),
          full: t("ua-pl.borders.uhryniv.full"),
        },
        {
          key: "nyzhankovychi",
          coords: { lat: 49.684849, lon: 22.815098 },
          labelfun: () => t("ua-pl.borders['nyzhankovychi'].label"),
          label: t("ua-pl.borders.nyzhankovychi.label"),
          full: t("ua-pl.borders.nyzhankovychi.full"),
        },
      ],
    },
    {
      key: "pl-ua",
      name: t("pl-ua.name"),
      borders: [
        {
          key: "korchova",
          coords: { lat: 49.960124, lon: 23.093133 },
          labelfun: () => t("pl-ua.borders['korchova'].label"),
          label: t("pl-ua.borders.korchova.label"),
          full: t("pl-ua.borders.korchova.full"),
        },
        {
          key: "grebenne",
          coords: { lat: 50.280968, lon: 23.574843 },
          labelfun: () => t("pl-ua.borders['grebenne'].label"),
          label: t("pl-ua.borders.grebenne.label"),
          full: t("pl-ua.borders.grebenne.full"),
        },
        {
          key: "medyka",
          coords: { lat: 49.799037, lon: 22.927931 },
          labelfun: () => t("pl-ua.borders['medyka'].label"),
          label: t("pl-ua.borders.medyka.label"),
          full: t("pl-ua.borders.medyka.full"),
        },
        {
          key: "zosin",
          coords: { lat: 50.859436, lon: 24.129815 },
          labelfun: () => t("pl-ua.borders['zosin'].label"),
          label: t("pl-ua.borders.zosin.label"),
          full: t("pl-ua.borders.zosin.full"),
        },
        {
          key: "dorohusk",
          coords: { lat: 51.174709, lon: 23.788073 },
          labelfun: () => t("pl-ua.borders['dorohusk'].label"),
          label: t("pl-ua.borders.dorohusk.label"),
          full: t("pl-ua.borders.dorohusk.full"),
        },
        {
          key: "budomierz",
          coords: { lat: 50.099551, lon: 23.263964 },
          labelfun: () => t("pl-ua.borders['budomierz'].label"),
          label: t("pl-ua.borders.budomierz.label"),
          full: t("pl-ua.borders.budomierz.full"),
        },
        {
          key: "kroscienko",
          coords: { lat: 49.478881, lon: 22.686546 },
          labelfun: () => t("pl-ua.borders['kroscienko'].label"),
          label: t("pl-ua.borders.kroscienko.label"),
          full: t("pl-ua.borders.kroscienko.full"),
        },
        {
          key: "dolhobychuv",
          coords: { lat: 50.579557, lon: 24.068752 },
          labelfun: () => t("pl-ua.borders['dolhobychuv'].label"),
          label: t("pl-ua.borders.dolhobychuv.label"),
          full: t("pl-ua.borders.dolhobychuv.full"),
        },
        {
          key: "malkhovitse",
          coords: { lat: 49.699089, lon: 22.818068 },
          labelfun: () => t("pl-ua.borders['malkhovitse'].label"),
          label: t("pl-ua.borders.malkhovitse.label"),
          full: t("pl-ua.borders.malkhovitse.full"),
        },
      ],
    },
    {
      key: "ua-sk",
      name: t("ua-sk.name"),
      borders: [
        {
          key: "uzhhorod",
          coords: { lat: 48.645994, lon: 22.266862 },
          labelfun: () => t("ua-sk.borders['uzhhorod'].label"),
          label: t("ua-sk.borders.uzhhorod.label"),
          full: t("ua-sk.borders.uzhhorod.full"),
        },
        {
          key: "mali-selmentsi",
          coords: { lat: 48.512713, lon: 22.160889 },
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
          coords: { lat: 48.666869, lon: 22.257469 },
          labelfun: () => t("sk-ua.borders['vysne-nemecke'].label"),
          label: t("sk-ua.borders.vysne-nemecke.label"),
          full: t("sk-ua.borders.vysne-nemecke.full"),
        },
        {
          key: "velke-selmentsi",
          coords: { lat: 48.509273, lon: 22.146722 },
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
          coords: { lat: 48.430261, lon: 22.175705 },
          labelfun: () => t("ua-hu.borders['chop'].label"),
          label: t("ua-hu.borders.chop.label"),
          full: t("ua-hu.borders.chop.full"),
        },
        {
          key: "luzhanka",
          coords: { lat: 48.168436, lon: 22.588532 },
          labelfun: () => t("ua-hu.borders['luzhanka'].label"),
          label: t("ua-hu.borders.luzhanka.label"),
          full: t("ua-hu.borders.luzhanka.full"),
        },
        {
          key: "dzvinkove",
          coords: { lat: 48.310792, lon: 22.34478 },
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
          coords: { lat: 48.403362, lon: 22.166586 },
          labelfun: () => t("hu-ua.borders['zahony'].label"),
          label: t("hu-ua.borders.zahony.label"),
          full: t("hu-ua.borders.zahony.full"),
        },
        {
          key: "berehshuran",
          coords: { lat: 48.158802, lon: 22.556111 },
          labelfun: () => t("hu-ua.borders['berehshuran'].label"),
          label: t("hu-ua.borders.berehshuran.label"),
          full: t("hu-ua.borders.berehshuran.full"),
        },
        {
          key: "lonya",
          coords: { lat: 48.321452, lon: 22.306478 },
          labelfun: () => t("hu-ua.borders['lonya'].label"),
          label: t("hu-ua.borders.lonya.label"),
          full: t("hu-ua.borders.lonya.full"),
        },
      ],
    },
    {
      key: "ua-ro",
      name: t("ua-ro.name"),
      borders: [
        {
          key: "porubne",
          coords: { lat: 47.998364, lon: 26.051535 },
          labelfun: () => t("ua-ro.borders['porubne'].label"),
          label: t("ua-ro.borders.porubne.label"),
          full: t("ua-ro.borders.porubne.full"),
        },
        {
          key: "dyakove",
          coords: { lat: 48.006331, lon: 23.001868 },
          labelfun: () => t("ua-ro.borders['dyakove'].label"),
          label: t("ua-ro.borders.dyakove.label"),
          full: t("ua-ro.borders.dyakove.full"),
        },
        {
          key: "solotvyno",
          coords: { lat: 47.946733, lon: 23.875105 },
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
          coords: { lat: 47.975658, lon: 26.065997 },
          labelfun: () => t("ro-ua.borders['siret'].label"),
          label: t("ro-ua.borders.siret.label"),
          full: t("ro-ua.borders.siret.full"),
        },
        {
          key: "halmeu",
          coords: { lat: 47.982295, lon: 23.008298 },
          labelfun: () => t("ro-ua.borders['halmeu'].label"),
          label: t("ro-ua.borders.halmeu.label"),
          full: t("ro-ua.borders.halmeu.full"),
        },
        {
          key: "sighet",
          coords: { lat: 47.941566, lon: 23.889143 },
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
          coords: { lat: 48.44904, lon: 27.785402 },
          labelfun: () => t("ua-md.borders['mohyliv'].label"),
          label: t("ua-md.borders.mohyliv.label"),
          full: t("ua-md.borders.mohyliv.full"),
        },
        {
          key: "mamalyha",
          coords: { lat: 48.261129, lon: 26.610646 },
          labelfun: () => t("ua-md.borders['mamalyga'].label"),
          label: t("ua-md.borders.mamalyga.label"),
          full: t("ua-md.borders.mamalyga.full"),
        },
        {
          key: "roshoshany",
          coords: { lat: 48.383376, lon: 27.032549 },
          //coords: { lat: 49.291698, lon: 25.69476 }, test
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
          coords: { lat: 48.442427, lon: 27.785359 },
          labelfun: () => t("md-ua.borders['otach'].label"),
          label: t("md-ua.borders.otach.label"),
          full: t("md-ua.borders.otach.full"),
        },
        {
          key: "criva",
          coords: { lat: 48.267442, lon: 26.640525 },
          labelfun: () => t("md-ua.borders['kryva'].label"),
          label: t("md-ua.borders.kryva.label"),
          full: t("md-ua.borders.kryva.full"),
        },
        {
          key: "briceni",
          coords: { lat: 48.370663, lon: 27.058983 },
          //coords: { lat: 49.295587, lon: 25.692561 }, test
          labelfun: () => t("md-ua.borders['brycheny'].label"),
          label: t("md-ua.borders.brycheny.label"),
          full: t("md-ua.borders.brycheny.full"),
        },
      ],
    },
  ])

  return { menu }
}
