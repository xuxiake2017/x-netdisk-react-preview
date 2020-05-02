import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import {
    useParams,
    useRouteMatch,
    useHistory,
    useLocation
} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
    btn: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'white',
        height: 48,
        padding: '0 30px',
    },
}));

export default function LinearDeterminate() {
    const classes = useStyles();
    const [completed, setCompleted] = React.useState(0);

    const loactaion = useLocation()
    const history = useHistory()

    React.useEffect(() => {
        function progress() {
            setCompleted((oldCompleted) => {
                if (oldCompleted === 100) {
                    return 0;
                }
                const diff = Math.random() * 10;
                return Math.min(oldCompleted + diff, 100);
            });
        }

        const timer = setInterval(progress, 500);
        return () => {
            clearInterval(timer);
        };
    }, []);

    const clickHandler = (e) => {
        console.log(e)
        console.log(loactaion)
        console.log(history)
        history.push("/")
    }

    return (
        <div className={classes.root}>
            <LinearProgress variant="determinate" value={completed} />
            <LinearProgress variant="determinate" value={completed} color="secondary" />
            <button className={classes.btn} onClick={clickHandler}>按钮</button>
        </div>
    );
}
