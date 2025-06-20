<script setup>
import { ref, onMounted } from "vue"

const borderPointName = ref("...")

const queueData = ref({
  buses: "...",
  cars: "...",
  tir: "...",
  foot: "...",
})

const waitTimeData = ref({
  buses: "...",
  cars: "...",
  tir: "...",
  foot: "...",
})

function calculateAverageQueue(queue) {
  const total = queue.reduce((acc, curr) => acc + curr, 0)
  return Math.round(total / queue.length)
}

function calculateAverageTime(waitTimes) {
  const total = waitTimes.reduce((acc, curr) => acc + curr, 0)
  return Math.round(total / waitTimes.length)
}

function getTrafficClass(value) {
  if (value === "-") return "status-gray"
  if (value <= 20) return "status-green"
  if (value <= 50) return "status-yellow"
  return "status-red"
}

async function fetchQueueData() {
  try {
    const { data, error } = await $fetch(
      "http://localhost:1337/api/border-queues"
    )

    if (error || !data) {
      setUnavailable()
      return
    }

    const busesQueue = []
    const carsQueue = []
    const tirQueue = []
    const footQueue = []

    data.forEach((entry) => {
      if (entry.buses !== null) busesQueue.push(entry.buses)
      if (entry.cars !== null) carsQueue.push(entry.cars)
      if (entry.tir !== null) tirQueue.push(entry.tir)
      if (entry.foot !== null) footQueue.push(entry.foot)
    })

    queueData.value = {
      buses: busesQueue.length ? calculateAverageQueue(busesQueue) : "-",
      cars: carsQueue.length ? calculateAverageQueue(carsQueue) : "-",
      tir: tirQueue.length ? calculateAverageQueue(tirQueue) : " - ",
      foot: footQueue.length ? calculateAverageQueue(footQueue) : "-",
    }

    waitTimeData.value = {
      buses: busesQueue.length ? calculateAverageTime(busesQueue) : "-",
      cars: carsQueue.length ? calculateAverageTime(carsQueue) : "-",
      tir: tirQueue.length ? calculateAverageTime(tirQueue) : "-",
      foot: footQueue.length ? calculateAverageTime(footQueue) : "-",
    }
  } catch (e) {
    console.error("Помилка отримання даних:", e)
    setUnavailable()
  }
}

function setUnavailable() {
  const unavailable = {
    buses: "-",
    cars: "-",
    tir: "-",
    foot: "-",
  }
  queueData.value = unavailable
  waitTimeData.value = unavailable
}

onMounted(() => {
  fetchQueueData()
  setInterval(fetchQueueData, 3600000)
})
</script>

<template>
  <div class="border-queue">
    <h2>{{ borderPointName }}</h2>

    <div class="sort-buttons">
      <button>1 г</button>
      <button>5 г</button>
      <button>12 г</button>
      <button>24 г</button>
      <button>тиж</button>
    </div>

    <div class="queue-row">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="25"
        :class="['bi bi-car-front-fill', getTrafficClass(queueData.cars)]"
        viewBox="0 0 16 16"
      >
        <path
          d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679q.05.242.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.8.8 0 0 0 .381-.404l.792-1.848ZM3 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2m10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2M6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2zM2.906 5.189a.51.51 0 0 0 .497.731c.91-.073 3.35-.17 4.597-.17s3.688.097 4.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 11.691 3H4.309a.5.5 0 0 0-.447.276L2.906 5.19Z"
        />
      </svg>
      <span>{{ queueData.cars }} авто</span>
      <span>{{ waitTimeData.cars }} хв</span>
    </div>

    <div class="queue-row">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="25"
        :class="['bi bi-bus-front-fill', getTrafficClass(queueData.buses)]"
        viewBox="0 0 16 16"
      >
        <path
          d="M16 7a1 1 0 0 1-1 1v3.5c0 .818-.393 1.544-1 2v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5V14H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2a2.5 2.5 0 0 1-1-2V8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1V2.64C1 1.452 1.845.408 3.064.268A44 44 0 0 1 8 0c2.1 0 3.792.136 4.936.268C14.155.408 15 1.452 15 2.64V4a1 1 0 0 1 1 1zM3.552 3.22A43 43 0 0 1 8 3c1.837 0 3.353.107 4.448.22a.5.5 0 0 0 .104-.994A44 44 0 0 0 8 2c-1.876 0-3.426.109-4.552.226a.5.5 0 1 0 .104.994M8 4c-1.876 0-3.426.109-4.552.226A.5.5 0 0 0 3 4.723v3.554a.5.5 0 0 0 .448.497C4.574 8.891 6.124 9 8 9s3.426-.109 4.552-.226A.5.5 0 0 0 13 8.277V4.723a.5.5 0 0 0-.448-.497A44 44 0 0 0 8 4m-3 7a1 1 0 1 0-2 0 1 1 0 0 0 2 0m8 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m-7 0a1 1 0 0 0 1 1h2a1 1 0 1 0 0-2H7a1 1 0 0 0-1 1"
        />
      </svg>
      <span>{{ queueData.buses }} автобусів</span>
      <span>{{ waitTimeData.buses }} хв</span>
    </div>
    <!-- Аналогічно додай TIR і пішоходи зі стилями -->
    <div class="queue-row">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="25"
        :class="['bi bi-truck', getTrafficClass(queueData.tir)]"
        viewBox="0 0 16 16"
      >
        <path
          d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.732 11h5.536a2 2 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456M12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"
        />
      </svg>
      <span>{{ queueData.tir }} вантажівок</span>
      <span>{{ waitTimeData.tir }} хв</span>
    </div>
    <div class="queue-row" v-if="queueData.foot !== 'Дані відсутні'">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="25"
        :class="['bi bi-person-walking', getTrafficClass(queueData.foot)]"
        viewBox="0 0 16 16"
      >
        <path
          d="M9.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M6.44 3.752A.75.75 0 0 1 7 3.5h1.445c.742 0 1.32.643 1.243 1.38l-.43 4.083a1.8 1.8 0 0 1-.088.395l-.318.906.213.242a.8.8 0 0 1 .114.175l2 4.25a.75.75 0 1 1-1.357.638l-1.956-4.154-1.68-1.921A.75.75 0 0 1 6 8.96l.138-2.613-.435.489-.464 2.786a.75.75 0 1 1-1.48-.246l.5-3a.75.75 0 0 1 .18-.375l2-2.25Z"
        />
        <path
          d="M6.25 11.745v-1.418l1.204 1.375.261.524a.8.8 0 0 1-.12.231l-2.5 3.25a.75.75 0 1 1-1.19-.914zm4.22-4.215-.494-.494.205-1.843.006-.067 1.124 1.124h1.44a.75.75 0 0 1 0 1.5H11a.75.75 0 0 1-.531-.22Z"
        />
      </svg>
      <span>{{ queueData.foot }} осіб</span>
      <span>{{ waitTimeData.foot }} хв</span>
    </div>

    <div class="queue-row" v-else>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="25"
        :class="['bi bi-person-walking', getTrafficClass(queueData.foot)]"
        viewBox="0 0 16 16"
      >
        <path
          d="M9.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M6.44 3.752A.75.75 0 0 1 7 3.5h1.445c.742 0 1.32.643 1.243 1.38l-.43 4.083a1.8 1.8 0 0 1-.088.395l-.318.906.213.242a.8.8 0 0 1 .114.175l2 4.25a.75.75 0 1 1-1.357.638l-1.956-4.154-1.68-1.921A.75.75 0 0 1 6 8.96l.138-2.613-.435.489-.464 2.786a.75.75 0 1 1-1.48-.246l.5-3a.75.75 0 0 1 .18-.375l2-2.25Z"
        />
        <path
          d="M6.25 11.745v-1.418l1.204 1.375.261.524a.8.8 0 0 1-.12.231l-2.5 3.25a.75.75 0 1 1-1.19-.914zm4.22-4.215-.494-.494.205-1.843.006-.067 1.124 1.124h1.44a.75.75 0 0 1 0 1.5H11a.75.75 0 0 1-.531-.22Z"
        />
      </svg>
      <span>-</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.border-queue {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 700px;
  margin: 0 auto;
  padding: 1.5rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

h2 {
  font-size: 1.75rem;
  color: var(--themes-accent, #4db6ac);
  margin-bottom: 1rem;
  text-align: center;
}

.sort-buttons {
  display: flex;
  justify-content: center;
  gap: 0.6rem;
  margin-bottom: 1rem;

  button {
    background-color: #37474f;
    color: #fff;
    border: none;
    border-radius: 0.5rem;
    padding: 6px 12px;
    font-size: 0.9rem;
    cursor: not-allowed;
    opacity: 0.6;
  }
}

.queue-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(255, 255, 255, 0.15);
  padding: 1rem;
  border-radius: 0.75rem;
  gap: 1rem;

  span {
    flex: 1;
    font-weight: 500;
    text-align: center;

    &:first-of-type {
      text-align: left;
    }

    &:last-of-type {
      text-align: right;
    }
  }

  svg {
    flex-shrink: 0;
  }
}

/* Статуси */
.status-gray {
  fill: #9e9e9e !important;
}
.status-green {
  fill: #4caf50 !important;
}
.status-yellow {
  fill: #ffeb3b !important;
}
.status-red {
  fill: #f44336 !important;
}
</style>
