import { useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = momentLocalizer(require('moment'))

interface Event {
  id: number
  title: string
  start: Date
  end: Date
  label: string
  resource?: any
}

export default function App() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: '会議',
      start: new Date(2024, 8, 10, 10, 0),
      end: new Date(2024, 8, 10, 11, 0),
      label: 'work'
    },
    {
      id: 2,
      title: '友人と食事',
      start: new Date(2024, 8, 15, 18, 0),
      end: new Date(2024, 8, 15, 19, 30),
      label: 'personal'
    }
  ])

  const [selectedLabels, setSelectedLabels] = useState<Set<string>>(new Set(['work', 'personal']))

  const labels = ['work', 'personal', 'hobby']

  const toggleLabel = (label: string) => {
    const newLabels = new Set(selectedLabels)
    if (newLabels.has(label)) {
      newLabels.delete(label)
    } else {
      newLabels.add(label)
    }
    setSelectedLabels(newLabels)
  }

  const filteredEvents = events.filter(event => selectedLabels.has(event.label))

  const getLabelColor = (label: string) => {
    const colors: { [key: string]: string } = {
      work: 'bg-blue-500',
      personal: 'bg-pink-500',
      hobby: 'bg-purple-500'
    }
    return colors[label] || 'bg-gray-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-700 mb-2">
            ✨ My Calendar
          </h1>
          <p className="text-gray-600">TimerTree と連携するかわいいカレンダー</p>
        </div>

        {/* ラベル選択 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            📌 表示するスケジュール
          </h2>
          <div className="flex gap-4 flex-wrap">
            {labels.map(label => (
              <button
                key={label}
                onClick={() => toggleLabel(label)}
                className={`px-4 py-2 rounded-full font-semibold transition-all ${
                  selectedLabels.has(label)
                    ? `${getLabelColor(label)} text-white shadow-lg scale-105`
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {label === 'work' && '💼'}
                {label === 'personal' && '👥'}
                {label === 'hobby' && '🎨'}
                {' '}{label}
              </button>
            ))}
          </div>
        </div>

        {/* カレンダー表示 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['日', '月', '火', '水', '木', '金', '土'].map(day => (
              <div key={day} className="text-center font-bold text-purple-600">
                {day}
              </div>
            ))}
          </div>

          {/* イベントリスト */}
          <div className="space-y-3">
            {filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <div
                  key={event.id}
                  className={`${getLabelColor(event.label)} text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow`}
                >
                  <h3 className="font-semibold text-lg">{event.title}</h3>
                  <p className="text-sm opacity-90">
                    {format(event.start, 'yyyy年MM月dd日 HH:mm')}
                  </p>
                  <span className="inline-block mt-2 text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                    {event.label}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-8">
                表示するスケジュールがありません
              </div>
            )}
          </div>
        </div>

        {/* 共有情報 */}
        <div className="bg-blue-50 rounded-lg shadow p-4 mt-6 text-center">
          <p className="text-gray-600">
            🔗 このカレンダーを共有するには、このページのURLを友人に送ってください
          </p>
        </div>
      </div>
    </div>
  )
}
