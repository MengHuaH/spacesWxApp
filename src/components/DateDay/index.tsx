import { View, ScrollView } from '@tarojs/components';
import Card from '../Card';
import { useReducer } from 'react';
import Day from './Day';
import { useLoad } from '@tarojs/taro';
import './index.scss'
import { AtButton, AtInputNumber } from 'taro-ui';

const initialState = {
    dateList: [],
    inputNumberValue: 0
}

const btnList = [
    {
        text: '2小时',
        num: 2 * 60
    },
    {
        text: '3小时',
        num: 3 * 60
    },
    {
        text: '4小时',
        num: 4 * 60
    },
    {
        text: '测试（6分钟）',
        num: 6
    },
]

function reducer(state, action) {
    switch (action.type) {
        case 'changed_dateList':
            return {
                ...state,
                dateList: action.data
            };
        case 'changed_inputNumberValue':
            return {
                ...state,
                inputNumberValue: action.data
            };
    }
}
function DateDay({ duration, changedDuration, onDate }) {
    const [state, dispatch] = useReducer(reducer, initialState)
    const { dateList, inputNumberValue } = state


    function setDate() {
        var date = new Date()
        var arr: Date[] = [new Date()]

        for (let i = 0; i < 6; i++) {
            var newDate = date.setDate(date.getDate() + 1);
            arr.push(new Date(newDate))
        }
        dispatch({ type: 'changed_dateList', data: arr })
    }
    function handleChange(value) {
        console.log(value)
        dispatch({ type: 'changed_inputNumberValue', data: value })
        if (value == 0) {
            changedDuration(120, onDate)
        } 
        else {
            changedDuration(value * 60, onDate)
        }

    }
    useLoad(() => {
        setDate()
    })

    return (
        <>
            <ScrollView scrollX className='dateDay'>
                <View className='at-row dateDay_row'>
                    {dateList.map((value, e) =>
                        <View className='at-col'>
                            <Day date={value} onDate={onDate} onDateChange={(value) => changedDuration(duration, value)}></Day>
                        </View>
                    )}
                </View>
            </ScrollView>
            <ScrollView scrollX className='dateDay time'>
                <View className='at-row dateDay_row'>
                    {btnList.map((value, e) =>
                        <View className='at-col'>
                            <AtButton size='small' type={value.num == duration ? "primary" : undefined} onClick={() => changedDuration(value.num, onDate)}>{value.text}</AtButton>
                        </View>
                    )}
                    <View className='at-col'>
                        <AtInputNumber
                            type='number'
                            min={0}
                            step={1}
                            value={inputNumberValue}
                            onChange={(e) => handleChange(e)}
                        />
                    </View>

                </View>
            </ScrollView>
        </>
    )

}

export default DateDay