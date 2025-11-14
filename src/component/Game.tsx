import { useState, useEffect, useRef } from "react";
import "../Game.css";
import GameOver from "./GameOver";

const SCORE :number = 100;

const arrowObj :Record<string, string> = {
    'ArrowUp': '⬆️',
    'ArrowRight': '➡️',
    'ArrowDown': '⬇️',
    'ArrowLeft': '⬅️'
}

/**
 * level 올라가면 눌러야 하는 키의 길이도 길어진다.(최대 4개)
 * ex1) ["⬆️➡️", "⬇️➡️", "⬇️⬅️", "⬅️⬆️"]
 */
/**
 * 
 * @param level 
 * @returns arrow
 */
function randomArrow(level :number) :string {
    let arrow :string = "";
    if(level === 1) {
        return makeArrow(1);
    } else if(level === 2) {
        return makeArrow(2);
    } else if(level === 3) {
        return makeArrow(3);
    } else if(level > 3) {
        return makeArrow(4);
    }
    return arrow;
}

const arrows :string[] = ["⬆️", "➡️", "⬇️", "⬅️"];
function makeArrow(leng :number) :string {
    let arrow :string = "";
    for(let i = 0; i < leng; i++) {
        arrow = arrow + arrows[Math.floor(Math.random() * arrows.length)];
    }
    return arrow;
}

export default function Game() {
    // 일정 점수 이상 되면 증가(1000점이 증가할 때마다 level up)
    const levelRef = useRef(1);
    // 화살표, 최초의 화살표도 랜덤으로 생성
    const [arrow, setArrow] = useState<string>(randomArrow(1));
    // 같은 화살표가 나오는 경우 useEffect(..., [arrow])가 작동 안 되는 문제 해결을 위해
    const [arrowBool, setArrowBool] = useState<boolean>(false);
    // 화살표 나오는 시간, 일정 점수 이상 차면 점점 시간 감소, 최소 500ms
    const timeRef = useRef<number>(3000);
    // 점수
    const [score, setScore] = useState<number>(0);
    // 라이프, 0이 되면 게임 종료
    const [life, setLife] = useState<number>(3);
    // 게임 종료 여부
    const [over, setOver] = useState<boolean>(false);
    /**
     * event.key(입력된 "문자")
     * event.code(물리적 "키 위치") - 범용적
     */

    // life
    useEffect(() => {
        if(life === 0) {
            setOver(true);
        }
    }, [life]);

    // score
    useEffect(() => {
        if(score === 0) {
            return;
        }
        if(levelRef.current === parseInt(String(Number(score / 1000)))) {
            levelRef.current = levelRef.current + 1;
            // 점수가 100단위로 증가할 때마다 시간 100ms 씩 감소
            timeRef.current = (timeRef.current > 500 && score % SCORE === 0) ? timeRef.current - SCORE : timeRef.current;
        }
        userInput = ""; // 사용자 입력값 초기화
        const oldArrow = arrow;
        const newArrow = randomArrow(levelRef.current);
        // TODO - oldArrow와 newArrow 비교 FOR 같은 화살표가 연달아 나오는 경우를 처리
        if(oldArrow === newArrow) {
            setArrowBool(false);
        } else {
            setArrow(() => randomArrow(levelRef.current));
        }
    }, [score]);

    // arrow
    let userInput :string = "";
    useEffect(() => {
        // let rightKeyPressed :boolean = false;
        const keyDownCallbackFn = (event :KeyboardEvent) => {
            userInput = userInput + arrowObj[event.code];
            if(arrow.length === userInput.length && arrow === userInput) {
                // rightKeyPressed = true;
                setScore(current => current + 100);
            } else if(arrow.length === userInput.length && arrow !== userInput) {
                // 사용자 입력값 초기화
                userInput = "";
                // 틀리면 목숨 감소, 0 되면 게임 종료
                setLife(current => current - 1);
            }
        }
        window.addEventListener("keydown", keyDownCallbackFn);

        // const timerId = setTimeout(() => {
        //     // 시간 내에 올바른 키 입력 못해도 목숨 감소, 0 되면 게임 종료
        //     // 이때에도 화살표 방향을 바꿀까? 아니면 그대로 둘까?
        //     if(!rightKeyPressed) {
        //         console.log(`key 눌러`);
        //         setLife(current => current - 1);
        //         if(life === 0) {
        //             setOver(true);
        //         }
        //     }
        // }, timeRef.current);

        // unmount
        return () => {
            window.removeEventListener("keydown", keyDownCallbackFn);
            // clearTimeout(timerId);
        }
    }, [arrow]);

    return (
        <>
            {
                over
                ? <GameOver />
                : 
                    <>
                        <div className="title">
                            <span>Time : {timeRef.current}</span>
                            <br/>
                            <span>Score : {score}</span>
                            <br/>
                            <span>Life : {life}</span>
                            <br/>
                            <span>Level : {levelRef.current}</span>
                        </div>
                        <h1>{arrow}</h1>
                    </>
            }
        </>
    )
}