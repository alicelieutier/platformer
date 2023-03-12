class Timer {
  constructor() {
    this.startTime = null
    this.endTime = null
  }

  start() {
    if (this.startTime === null) {
      this.startTime = Date.now()
    }
  }

  stop() {
    if (this.endTime === null) {
      this.endTime = Date.now()
    }
  }

  getTimeInMs() {
    if (this.startTime !== null && this.endTime !== null) {
      return this.endTime - this.startTime
    }
    if (this.startTime !== null) {
      return Date.now() - this.startTime
    }
    return 0
  }

  getTimeString() {
    const timeInMs = this.getTimeInMs()
    const minutes = Math.floor(timeInMs / (60*1000))
    const seconds = Math.floor((timeInMs % (60*1000)) / 1000)
    const hundredths = Math.floor((timeInMs % 1000) / 10)
    return `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}:${hundredths.toString().padStart(2,'0')}`
  }
}
