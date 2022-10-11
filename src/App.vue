<script setup lang="ts">
import { reactive, computed } from "vue";
import GuessingForm from "./components/guessing/GuessingForm.vue";
import GuessingHistory from "./components/guessing/GuessingHistory.vue";
import EndDisplay from "./components/EndDisplay.vue";
import HeaderNavigator from "./components/HeaderNavigator.vue";

import { getDayInformation, getRealDayNumber } from "./DailySelector";
import QuoteDisplay from "./components/QuoteDisplay.vue";

const urlParameters = new URLSearchParams(window.location.search);
const requestedDay = urlParameters.get("day");

if (
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line no-undef
  process.env.NODE_ENV === "production" &&
  requestedDay &&
  parseInt(requestedDay) > getRealDayNumber()
) {
  window.location.href = "/";
}

const { dayNumber, answer, quotes } = reactive(getDayInformation(requestedDay));

const guesses: string[] = reactive([]);
const stats = JSON.parse(localStorage.getItem("stats") || "{}");

if (localStorage.getItem("dayNumber") === dayNumber.toString()) {
  guesses.push(...JSON.parse(localStorage.getItem("guesses") || "[]"));
} else {
  localStorage.setItem("dayNumber", dayNumber.toString());
  localStorage.setItem("guesses", JSON.stringify([]));
}

const maxGuesses = computed(() => quotes.length);
const currentQuote = computed(
  () => quotes[Math.min(currentRound.value - 1, quotes.length - 1)]
);
const currentRound = computed(() => guesses.length + 1);
const hasWon = computed(
  () => guesses.length > 0 && guesses[guesses.length - 1] === answer
);
const isGameEnded = computed(
  () => currentRound.value === quotes.length + 1 || hasWon.value
);

const updateStats = (score: number) => {
  stats[dayNumber] = score;
  if (!stats.firstPlayed) {
    stats.firstPlayed = dayNumber;
  }
  stats.lastPlayed = dayNumber;
  localStorage.setItem("stats", JSON.stringify(stats));

  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line no-undef
    // cabin.event(`Result ${dayNumber} : ${score}`);
  } catch (e) {
    console.log(e);
  }
};

const onSubmittedGuess = (guess: string) => {
  guesses.push(guess);
  localStorage.setItem("guesses", JSON.stringify(guesses));
  if (guess === answer) {
    updateStats(currentRound.value - 1);

    return;
  }

  if (isGameEnded.value) {
    updateStats(0);

    return;
  }
};
</script>

<template>
  <HeaderNavigator />
  <main>
    <QuoteDisplay :current-quote="currentQuote" />

    <div v-if="!isGameEnded">
      <GuessingForm @submitted-guess="onSubmittedGuess" />
      <GuessingHistory
        :guesses="guesses"
        :answer="answer"
        :max-guesses="maxGuesses"
      />
    </div>

    <EndDisplay
      v-else
      :guesses="guesses"
      :has-won="hasWon"
      :day-number="dayNumber"
      :answer="answer"
      :max-guesses="maxGuesses"
    />
  </main>
</template>

<style>
@import "./assets/base.css";

main {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 1rem;
}

.monument-hint {
  text-align: center;
}
</style>
