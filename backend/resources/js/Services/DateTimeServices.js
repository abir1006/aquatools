import React from 'react';

class DateTimeServices {
    getDateTime(dateTimeString) {
        const date = new Date(dateTimeString);
        const month = parseInt(date.getMonth()) + 1;
        return date.getDate() + '/' + month + '/' + date.getFullYear() + ' ' + date.toLocaleTimeString();
    }

    getCurrentDateTime() {
        const currentDate = new Date();
        const month = parseInt(currentDate.getMonth()) + 1;
        return currentDate.getDate() + '/' + month + '/' + currentDate.getFullYear() + ' ' + currentDate.toLocaleTimeString();
    }

    getCurrentDate() {
        const currentDate = new Date();
        const month = parseInt(currentDate.getMonth()) + 1;
        return currentDate.getDate() + '/' + month + '/' + currentDate.getFullYear();
    }

    getFutureDate(dateStr, noOfYear) {
        const date = new Date(dateStr);
        date.toLocaleDateString();
        let day = parseInt(date.getDate()) - 1;
        let month = parseInt(date.getMonth()) + 1;
        let year = parseInt(date.getFullYear()) + noOfYear;
        return day + '/' + month + '/' + year;
    }

    getCurrentDateTimeForPDF() {
        const currentDate = new Date();
        const month = parseInt(currentDate.getMonth()) + 1;
        return currentDate.getDate() + month.toString() + currentDate.getFullYear() + currentDate.getHours().toString() + currentDate.getMinutes().toString() + currentDate.getSeconds().toString();
    }

    getTimeDifferent(dateStr) {
        const date = new Date(dateStr);
        const specificDateTime = date.getTime();
        const currentDate = new Date();
        const currentDateTime = currentDate.getTime();
        let diff = 0;
        let day, second, minute, hour, week, month, year = 0;

        second = Math.round((currentDateTime - specificDateTime) / 1000);
        diff = second;
        let unit = diff <= 1 ? 'second' : 'seconds';


        if (second > 59) {
            minute = Math.round(second / 60);
            diff = minute;
            unit = diff <= 1 ? 'minute' : 'minutes';
        }

        if (minute > 59) {
            hour = Math.round(minute / 60);
            diff = hour;
            unit = diff <= 1 ? 'hour' : 'hours';
        }

        if (hour > 23) {
            day = Math.round(hour / 24);
            diff = day;
            unit = diff <= 1 ? 'day' : 'days';
        }

        if (day > 6) {
            week = Math.round(day / 7);
            diff = week;
            unit = diff <= 1 ? 'week' : 'weeks';
        }

        if (day > 29) {
            month = Math.round(day / 30);
            diff = month;
            unit = diff <= 1 ? 'month' : 'months';
        }

        if (month > 11) {
            year = Math.round(month / 12);
            diff = year;
            unit = diff <= 1 ? 'year' : 'years';
        }

        //date.toLocaleDateString();

        return diff + ' ' + unit;
    }
}

const DateTimeService = new DateTimeServices();

export default DateTimeService;
