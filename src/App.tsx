import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from 'date-fns'
import { ja } from 'date-fns/locale'
import './index.css'

interface Event {
  id: number
  title: string
  date: Date
  label: string
}

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 8, 1))
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: '会議',
      date: new Date(2024, 8, 10),
      label: 'work'
    },
    {
      id: 2,
      title: '友人と食事',
      date: new Date(2024, 8, 15),
      label: 'personal'
    }
  ])

  const [selectedLabels, setSelectedLabels] = useState<Set<string>>(new Set(['work', 'personal', 'hobby']))

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

  const getLabelColor = (label: string) => {
    const colors: { [key: string]: string } = {
      work: 'bg-blue-500',
      personal: 'bg-pink-500',
      hobby: 'bg-purple-500'
    }
    return colors[label] || 'bg-gray-500'
  }

  const getDaysInMonth = (date: Date) => {
    const start = startOfMonth(date)
    const end = endOfMonth(date)
    return eachDayOfInterval({ start, end })
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString() &&
      selectedLabels.has(event.label)
    )
  }

  const days = getDaysInMonth(currentDate)
  const firstDay = days[0].getDay()
  const calendarDays = [...Array(firstDay).fill(null), ...days]

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

        {/* カレンダー */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* 月ナビゲーション */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              ← 前月
            </button>
            <h2 className="text-2xl font-bold text-purple-700">
              {format(currentDate, 'yyyy年MM月', { locale: ja })}
            </h2>
            <button
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              次月 →
            </button>
          </div>

          {/* 曜日 */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['日', '月', '火', '水', '木', '金', '土'].map(day => (
              <div key={day} className="text-center font-bold text-purple-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* カレンダーグリッド */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`min-h-24 p-2 rounded-lg ${
                  day ? 'bg-gray-50 border-2 border-gray-200' : 'bg-gray-100'
                }`}
              >
                {day && (
                  <>
                    <p className="font-bold text-gray-700 mb-2">
                      {format(day, 'd')}
                    </p>
                    <div className="space-y-1">
                      {getEventsForDate(day).map(event => (
                        <div
                          key={event.id}
                          className={`${getLabelColor(event.label)} text-white text-xs p-1 rounded truncate`}
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
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
