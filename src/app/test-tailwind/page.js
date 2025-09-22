export default function TestTailwind() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Tailwind CSS Test</h1>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Wenn du diese Farben siehst, funktioniert Tailwind! 🎉</h2>

        {/* Test verschiedene Farben */}
        <div className="flex gap-4 flex-wrap">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Blauer Button
          </button>

          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Grüner Button
          </button>

          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Roter Button
          </button>

          <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
            Lila Button
          </button>

          <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
            Gelber Button
          </button>
        </div>

        {/* Test verschiedene Utilities */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium mb-2">Verschiedene Tailwind Features:</h3>
          <ul className="list-disc list-inside space-y-2">
            <li className="text-blue-600">Text in Blau</li>
            <li className="text-green-600">Text in Grün</li>
            <li className="text-red-600">Text in Rot</li>
            <li className="font-bold">Fetter Text</li>
            <li className="italic">Kursiver Text</li>
            <li className="underline">Unterstrichener Text</li>
          </ul>
        </div>

        {/* Test Grid Layout */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-200 p-4 rounded">Box 1</div>
          <div className="bg-green-200 p-4 rounded">Box 2</div>
          <div className="bg-red-200 p-4 rounded">Box 3</div>
        </div>

        {/* Test mit Gradient */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
          <p className="text-xl">Wenn du diesen Farbverlauf siehst, läuft alles perfekt!</p>
        </div>
      </div>
    </div>
  )
}