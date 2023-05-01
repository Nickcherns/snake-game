import React, {Component} from "react";
import "./game.css"

// keycode mapping for direction changes
const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;
const STOP = 32; // space for pause

// create array for board
const HEIGHT = 10;
const WIDTH = 10;

const getRandom = () => {
    return {
        x: Math.floor(Math.random() * WIDTH),
        y: Math.floor(Math.random() * HEIGHT)
    }
}

const emptyRows = () => [...Array(WIDTH)].map((_) =>
                        [...Array(HEIGHT)].map((_) => 'grid-item'));
// debug: value verification
console.log(emptyRows());

const increaseSpeed = (speed) => speed - 10 * (speed > 10);

const initialState = {
    rows: emptyRows(),
    snake: [{x: Math.floor(WIDTH/2), y: Math.floor(HEIGHT/2)}],
    food: getRandom(),
    direction: STOP,
    speed: 200,
}

export default class App extends Component {
    constructor() {
        super();
        this.state = initialState;
    }

    componentDidMount() {
        setInterval(this.moveSnake, this.state.speed);
        document.onkeydown = this.changeDirection;
        document.title = "snake-game";
    }

    componentDidUpdate() {
        this.isCollapsed();
        this.isEaten();
    }

    moveSnake = () => {
        // defines how the snake moves in the board
        let snakeCopy = [...this.state.snake];
        let head = { ...snakeCopy[snakeCopy.length - 1] };
        switch (this.state.direction) {
            case LEFT: 
                head.y -= 1; 
                break;
            case UP: 
                head.x -= 1; 
                break;
            case RIGHT: 
                head.y += 1; 
                break;
            case DOWN: 
                head.x += 1; 
                break;
            default: 
                return;
        }
        // keep value within range of 0 to HEIGHT
        head.x += HEIGHT * ((head.x < 0)-(head.x >= HEIGHT));
        head.y += WIDTH * ((head.y < 0)-(head.y >= WIDTH));

        snakeCopy.push(head);
        snakeCopy.shift();
        this.setState({
            snake: snakeCopy,
            head: head,
        })
        this.update();
    }

    isEaten() {
        // check if food is eaten
        // if eaten, increase size of snake
        //      and speed
        // remove current food and create new food in 
        //      random position
        let snakeCopy = [...this.state.snake];
        let head = {...snakeCopy[snakeCopy.length-1]};
        let food = this.state.food;
        if ((head.x === food.x) && (head.y === food.y)) {
            snakeCopy.push(head);
            this.setState({
                snake: snakeCopy,
                food: getRandom(),
                speed: increaseSpeed(this.state.speed)
            });
        }
    }

    isCollapsed() {
        // collision check
        // end game and show score
        let snake = this.state.snake;
        let head = {...snake[snake.length-1]};
        for (let i = 0; i < snake.length-3; i++) {
            if ((head.x === snake[i].x) && (head.y === snake[i].y)) {
                console.log('head:', head);
                this.setState(initialState);
                alert(`game over: ${snake.length*10}`);
            }
            
        }
    }    

    update() {
        // update snake and food position in the board
        let newRows = emptyRows();
        this.state.snake.forEach(element => newRows[element.x][element.y] = 'snake');
        newRows[this.state.food.x][this.state.food.y] = "food";
        this.setState({rows: newRows});
    }

    
    changeDirection = ({keyCode}) => {
        let direction = this.state.direction;
        switch (keyCode) {
            case LEFT:
                direction = (direction === RIGHT)? LEFT: LEFT;
                break;
            case RIGHT:
                direction = (direction === LEFT)? RIGHT: RIGHT;
                break;
            case UP:
                direction = (direction === DOWN)? UP: UP;
                break;
            case DOWN:
                direction = (direction === UP)? DOWN: DOWN;
                break;
            case STOP:
                direction = STOP;
                break;
            default:
                break;
        }
        this.setState({
            direction: direction,
        });
    }

    render() {
        const displayRows = this.state.rows.map((row, i) =>
                            row.map((value, j) =>
                            <div name={`${i}=${j}`} 
                                 className={value} />))
        return (
        <div>
            <div id="instructions">
                    <h1> Snake Game</h1>
                    <ul>
                        <li>press "space" to pause the game</li>
                        <li>press "arrow keys" to change direction</li>
                    </ul>
            </div>
            <div className="a">
                <div className="snake-container">
                    <div className="grid">{displayRows}</div>
                </div>
            </div>
        </div>
        )
    }
}