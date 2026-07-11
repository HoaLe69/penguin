import moment from 'moment'

export default function formatTime(time: string | number | Date): string {
  const inputDate = new Date(time)
  return moment(inputDate).fromNow()
}
