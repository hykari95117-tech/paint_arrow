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

let userInputArrows :string = "";
const arrows :string[] = ["⬆️", "➡️", "⬇️", "⬅️"];

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
    const [arrow, setArrow] = useState<string>(arrows[Math.floor(Math.random() * arrows.length)]);
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

    // arrow state 바뀔 때만
    useEffect(() => {
        // 일정 시간이 지나도 키 입력 자체를 하지 않았을 때
        let rightKeyPressed :boolean = false;

        const keyDownCallbackFn = (event :KeyboardEvent) => {
            userInputArrows = userInputArrows + arrowObj[event.code];
            if(arrow.length === userInputArrows.length) {
                if(arrow === userInputArrows) {
                    rightKeyPressed = true;
                    // 맞을 때마다 점수 +100
                    setScore(current => {
                        // 점수가 1000의 배수일 경우 level up
                        const plusedScore = current + SCORE;
                        if(score > 0 && levelRef.current === parseInt(String(Number(plusedScore / 1000)))) {
                            levelRef.current = levelRef.current + 1;
                            // 점수가 100단위로 증가할 때마다 시간 100ms 씩 감소
                            if(timeRef.current > 500 && plusedScore % SCORE === 0) {
                                timeRef.current = timeRef.current - SCORE;
                            }
                        }
                        return current + SCORE;
                    })
                    // 화살표 변경
                    // setArrow(arrows[Math.floor(Math.random() * arrows.length)]);
                    setArrow(() => {
                        userInputArrows = ""; // 사용자 입력값 초기화
                        return randomArrow(levelRef.current);
                    });
                } else {
                    // 틀리면 목숨 감소, 0 되면 게임 종료
                    setLife((current) => {
                        if(current === 1) {
                            setOver(true);
                        }
                        userInputArrows = ""; // 사용자 입력값 초기화
                        return current - 1;
                    });
                }
            }
        }
        
        window.addEventListener("keydown", keyDownCallbackFn);

        const timerId = setTimeout(() => {
            // 시간 내에 올바른 키 입력 못해도 목숨 감소, 0 되면 게임 종료
            // 이때에도 화살표 방향을 바꿀까? 아니면 그대로 둘까?
            if(!rightKeyPressed) {
                console.log(`key 눌러`);
                setLife((current) => {
                    if(current === 1) {
                        setOver(true);
                    }
                    return current - 1;
                });
            }
        }, timeRef.current);

        // unmount
        return () => {
            window.removeEventListener("keydown", keyDownCallbackFn);
            clearTimeout(timerId);
        };
    }, [arrow, life]);

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