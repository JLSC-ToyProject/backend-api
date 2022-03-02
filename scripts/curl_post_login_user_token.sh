CODE=$1
COPER='kakao'
curl -X POST "http://localhost:3000/login/user/token" -H "Content-Type: application/json" -d '{"code":"'${CODE}'", "coperation":"'${COPER}'"}'

sleep 10