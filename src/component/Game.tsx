import { useState, useEffect, useRef } from "react";
import "../Game.css";
import GameOver from "./GameOver";

interface arrow {
    arrow : string
}

const arrowObj_interface :arrow = {
    arrow : "asd"
}

const arrowObj :Record<string, string> = {
    'ArrowUp': '⬆️',
    'ArrowRight': '➡️',
    'ArrowDown': '⬇️',
    'ArrowLeft': '⬅️'
}
// 
/**
 * level 올라가면 복합키 조합도(최대 4개)
 * ex1) ["⬆️➡️", "⬇️➡️", "⬇️⬅️", "⬅️⬆️"]
 * 
 * level 길게 누르는 키 조합도(최대 4개)
 * ex1) ["⬆️⬆️", "⬆️⬆️⬆️", "⬅️⬅️⬅️⬅️", "➡️➡️⬆️"]
 */
const arrows :string[] = ["⬆️", "➡️", "⬇️", "⬅️"];
const SCORE :number = 100;

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

    // 컴포넌트 최초 mount 시
    useEffect(() => {

    }, []);

    // arrow state 바뀔 때만
    useEffect(() => {
        const callbackFn = (event :KeyboardEvent) => {
            const userPressedKey = arrowObj[event.code];
            if(arrow === userPressedKey) {
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
                setArrow(arrows[Math.floor(Math.random() * arrows.length)]);
            } else {
                // 틀리면 목숨 감소, 0 되면 게임 종료
                setLife((current) => {
                    if(current === 1) {
                        setOver(true);
                    }
                    return current - 1;
                });
            }
        }
        
        window.addEventListener("keydown", callbackFn);

        // const interval = setInterval(() => {
        //     const randomIndex = Math.floor(Math.random() * arrows.length);
        //     setArrow(arrows[randomIndex]);
        
        //     window.addEventListener("keydown", (event) => {
        //         const userPressedKey = arrowObj[event.code];
        //         if(arrow === userPressedKey) {
        //             console.log("O");
        //         } else {
        //             console.log("X");
        //         }
        //     });
        // }, 2000);

        

        // unmount
        return () => {
            window.removeEventListener("keydown", callbackFn);
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