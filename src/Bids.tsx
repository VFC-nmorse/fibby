import { useRealtime } from 'react-supabase';

export const Bids = () => {
    const [bids, reexecute] = useRealtime('bids')

    const { data, fetching, error } = bids;

    if (fetching) {
        return (<p> Loathing </p>);
    }
    if (error) {
        return <p>Oh no... { error.message } </p>;
    }
    if (!data) {
        return <div>What no data!?</div>
    }

    return (
        <ul>
        {
            data.map((b) => (
                <li key={ b.id } > { b.value } </li>
            ))
        }
        </ul>
    );
}

export default Bids;