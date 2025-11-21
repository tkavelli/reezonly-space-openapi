#!/bin/bash

# Reezonly Space API Documentation Server

echo "🚀 Запуск сервера документации Reezonly Space API..."
echo "📖 Документация будет доступна по адресу: http://localhost:3000"
echo ""
echo "📝 Файлы:"
echo "   📄 OpenAPI spec: space-platform-api.yaml"
echo "   🌐 HTML docs: index.html"
echo "   📋 README: README_SPACE_API.md"
echo ""
echo "⏹️  Остановка: Ctrl+C"
echo "🔄 Перезапуск: ./start.sh"
echo ""
echo "Starting server on port 3000..."

# Check if port 3000 is already in use
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Порт 3000 уже используется. Попытка освободить..."
    # Kill existing process on port 3000
    kill -9 $(lsof -t -i:3000) 2>/dev/null || true
    sleep 1
fi

# Start the server
python3 -m http.server 3000

echo "Сервер остановлен."