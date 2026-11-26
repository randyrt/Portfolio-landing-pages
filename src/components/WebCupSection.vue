<script setup>
import { language, t } from '../i18n'
</script>

<template>
  <section id="webcup" class="webcup-section" data-aos="fade-up">
    <div class="shell webcup-shell">
      <div class="webcup-heading">
        <div>
          <p class="kicker">04 / {{ t('webcupKicker') }}</p>
          <h2>{{ t('webcupTitle') }}<br><em>{{ t('webcupEm') }}</em></h2>
        </div>
        <p>{{ t('webcupIntro') }}</p>
      </div>

      <div class="webcup-case-study">
        <div class="webcup-visual">
          <div class="webcup-visual-top"><span>WEBCUP / 2024</span><span>CASE STUDY_01</span></div>
          <img src="/images/webcup24/webcup.jpg" :alt="t('webcupImageAlt')">
          <span class="webcup-stamp">BUILD<br>TOGETHER<br>✦</span>
        </div>

        <div class="webcup-content">
          <p class="webcup-eyebrow">{{ t('webcupLabel') }}</p>
          <h3>{{ t('webcupCardTitle') }}</h3>
          <p class="webcup-description">{{ t('webcupDescription') }}</p>

          <div class="webcup-pillars">
            <article><b>01</b><h4>{{ t('webcupPillarOne') }}</h4><p>{{ t('webcupPillarOneText') }}</p></article>
            <article><b>02</b><h4>{{ t('webcupPillarTwo') }}</h4><p>{{ t('webcupPillarTwoText') }}</p></article>
            <article><b>03</b><h4>{{ t('webcupPillarThree') }}</h4><p>{{ t('webcupPillarThreeText') }}</p></article>
          </div>

          <div class="webcup-footer">
            <span><i></i>{{ language === 'fr' ? 'Expérience collective' : 'Collective experience' }}</span>
            <a class="webcup-link" href="https://24h.webcup.fr/" target="_blank" rel="noopener noreferrer">https://24h.webcup.fr/ <b>↗</b></a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
