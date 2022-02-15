CODE=$1
COPER='kakao'
curl -X POST "http://localhost:3000/login/user" -H "Content-Type: application/json" -d '{"code":"'${CODE}'", "coperation":"'${COPER}'"}'
