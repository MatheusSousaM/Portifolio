const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const cellSize = 45; // Tamanho da célula do labirinto
const cols = 45; // Colunas do labirinto
const rows = 45; // Linhas do labirinto
let score = localStorage.getItem("score") || 0
function displayScore() {
  document.getElementById("score").innerHTML = score
}
displayScore()

canvas.width = cols * cellSize;
canvas.height = rows * cellSize;

let position = { x: 0, y: 0 }; // Posição inicial do jogador
let greenBlock = { x: cols - 2, y: rows - 2 }; // Posição final do bloco verde

const movekeys = {
  "arrowright": { x: 1, y: 0 },
  "arrowleft": { x: -1, y: 0 },
  "arrowup": { x: 0, y: -1 },
  "arrowdown": { x: 0, y: 1 },
  "d": { x: 1, y: 0 },
  "a": { x: -1, y: 0 },
  "w": { x: 0, y: -1 },
  "s": { x: 0, y: 1 }
};

document.addEventListener('keydown', function(event) {
  // Verifica se a tecla pressionada foi "R" (código da tecla: 82)
  if (event.key === 'r' || event.key === 'R') {
      // Reinicia a página
      location.reload();
  }
});


// Função para gerar um mapa vazio
function genMap(w = 45, h = 45) {
  let map = [];
  for (let y = 0; y < h; y++) {
    map[y] = [];
    for (let x = 0; x < w; x++) {
      map[y][x] = 1; // Começa como parede (1)
    }
  }
  return map;
}

// Função para embaralhar um array (usada para movimentação aleatória)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Algoritmo de backtracking para criar o labirinto
function createMaze(map, startX, startY) {
  const directions = [
    { x: 1, y: 0 },  // direita
    { x: -1, y: 0 }, // esquerda
    { x: 0, y: 1 },  // baixo
    { x: 0, y: -1 }  // cima
  ];

  map[startY][startX] = 0; // Marca a célula inicial como caminho (0)

  shuffleArray(directions); // Embaralha a ordem de direção para aleatoriedade

  for (const direction of directions) {
    const newX = startX + direction.x * 2;
    const newY = startY + direction.y * 2;

    // Verifica se o novo caminho está dentro dos limites do mapa e se não foi visitado
    if (newX >= 0 && newX < cols && newY >= 0 && newY < rows && map[newY][newX] === 1) {
      map[startY + direction.y][startX + direction.x] = 0; // Remove a parede entre os caminhos
      createMaze(map, newX, newY); // Recursão para continuar o labirinto
    }
  }
}

function removeWalls(wallsToRemove) {
  for (let i = 0; i < wallsToRemove.length; i++) {
    const wall = wallsToRemove[i];
    map[wall.y][wall.x] = 0;
  }
}

function removeWall(map) {
  const wallsToRemove = []

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      let tile = map[y][x]
      const topNeighbor = map[y - 1] && map[y - 1][x] ? map[y - 1][x] : false
      const bottomNeighbor = map[y + 1] && map[y + 1][x] ? map[y + 1][x] : false
      const leftNeighbor = map[y][x - 1] ? map[y][x - 1] : false
      const rightNeighbor = map[y][x + 1] ? map[y][x + 1] : false

      if (topNeighbor && bottomNeighbor && !leftNeighbor && !rightNeighbor || !topNeighbor && !bottomNeighbor && leftNeighbor && rightNeighbor) {
        if (Math.random() < 0.12) {
          wallsToRemove.push({ x: x, y: y })
        }
      }
    }
  }
  removeWalls(wallsToRemove)
}

// Função para desenhar o mapa
function drawMap(map) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === 1) {
        ctx.fillStyle = 'white'; // Paredes
      } else if (map[y][x] === 0) {
        ctx.fillStyle = 'transparent'; // Caminhos
      } else if (map[y][x] === 2) {
        ctx.fillStyle = 'limegreen'; // Bloco verde
      } else if (map[y][x] === 4) {
        ctx.fillStyle = '#cc00ff50';
      }
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }
}

// Função para desenhar o personagem
function drawPlayer() {
  ctx.fillStyle = '#dd00ff'; // Bloco roxo é o jogador
  ctx.fillRect(position.x * cellSize, position.y * cellSize, cellSize, cellSize);
}

let map = genMap(cols, rows);
createMaze(map, 0, 0); // Gera o labirinto começando no canto superior esquerdo
removeWall(map);
map[greenBlock.y][greenBlock.x] = 2; // Define o bloco verde na posição final

drawMap(map); // Desenha o mapa

// Lógica de movimentação do jogador
document.addEventListener('keydown', (event) => {
  const key = (event.key).toLowerCase();
  const move = movekeys[key];
  if (move) {
    const targetPosX = position.x + move.x;
    const targetPosY = position.y + move.y;

    // Verifica se o movimento é válido
    if (
      targetPosX >= 0 && targetPosX < cols &&
      targetPosY >= 0 && targetPosY < rows &&
      map[targetPosY][targetPosX] !== 1 &&
      map[targetPosY][targetPosX] !== 4 // Impede movimento sobre o rastro lilás
    ) {
      // Marca a posição atual com rastro lilás (4)
      map[position.y][position.x] = 4;

      // Atualiza a posição do jogador
      position.x = targetPosX;
      position.y = targetPosY;

      // Verifica se chegou ao bloco verde
      if (map[position.y][position.x] === 2) {
        alert("You Win!");
        score++
        localStorage.setItem("score", score)
        location.reload();
      }
    }

    // Limpa e redesenha o mapa e o jogador
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap(map);
    drawPlayer();
  }
});

// Desenha o jogador no início do jogo
drawPlayer();