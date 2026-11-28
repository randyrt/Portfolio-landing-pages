<script setup>
import { t } from '../i18n'
</script>

<template>
  <section class="workstation-section" aria-labelledby="workstation-title">
    <div class="workstation-shell">
      <div class="workstation-copy" data-aos="fade-right">
        <p class="workstation-kicker">{{ t('workstationKicker') }}</p>
        <h2 id="workstation-title">{{ t('workstationTitle') }} <em>{{ t('workstationEm') }}</em></h2>
        <p class="workstation-lede">{{ t('workstationText') }}</p>
        <p class="workstation-thanks">{{ t('workstationThanks') }}</p>
        <div class="workstation-points">
          <span>{{ t('workstationPointOne') }}</span>
          <span>{{ t('workstationPointTwo') }}</span>
          <span>{{ t('workstationPointThree') }}</span>
        </div>
      </div>
      <figure class="workstation-image" data-aos="fade-left" data-aos-delay="180">
        <img src="/images/me/me_working.png" :alt="t('workstationImageAlt')" loading="lazy">
        <figcaption>{{ t('workstationCaption') }}</figcaption>
      </figure>
    </div>
  </section>
</template>

<style scoped>
.workstation-section{background:#fff;color:#101827;padding:clamp(70px,9vw,130px) 0;border-top:1px solid #e7ebf1;overflow:hidden}
.workstation-shell{width:min(1180px,calc(100% - 40px));margin:auto;display:grid;grid-template-columns:.85fr 1.15fr;align-items:center;gap:clamp(35px,7vw,100px)}
.workstation-copy{max-width:470px}.workstation-kicker{color:#637083;font:600 11px var(--body-font,Arial,sans-serif);letter-spacing:.16em;text-transform:uppercase;margin:0 0 20px}.workstation-copy h2{font:600 clamp(38px,5vw,68px)/.98 var(--display-font,Arial,sans-serif);letter-spacing:-.04em;margin:0 0 25px}.workstation-copy h2 em{color:#168f89;font-style:italic}.workstation-lede{color:#596678;font:16px/1.75 var(--body-font,Arial,sans-serif);margin:0 0 14px}.workstation-thanks{color:#168f89;font:600 14px/1.6 var(--body-font,Arial,sans-serif);margin:0 0 28px}.workstation-points{display:flex;flex-wrap:wrap;gap:9px}.workstation-points span{border:1px solid #d9e1e9;border-radius:999px;color:#354255;font:600 11px var(--body-font,Arial,sans-serif);padding:9px 13px}.workstation-image{margin:0;position:relative}.workstation-image img{display:block;width:100%;height:auto;border-radius:18px;box-shadow:18px 22px 0 #e9f1f0,0 24px 55px #10233222}.workstation-image figcaption{color:#778394;font:10px var(--body-font,Arial,sans-serif);letter-spacing:.1em;margin-top:18px;text-align:right;text-transform:uppercase}
@media (max-width:760px){.workstation-shell{grid-template-columns:1fr;width:min(100% - 32px,560px)}.workstation-copy{max-width:none}.workstation-image img{box-shadow:10px 12px 0 #e9f1f0,0 18px 35px #10233222}.workstation-image figcaption{text-align:left}}
</style>
