<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Test</title>
    <style>
        body {
            font-family: sans-serif;
            padding: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }

        th,
        td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
        }
    </style>
</head>

<body>
    <form method="GET" action="" style="margin-bottom: 20px;">
        <input type="text" name="search" value="{{ request('search') }}" placeholder="Search name or car model...">
        <button type="submit">Search</button>
        <a href="{{ url()->current() }}">Clear</a>
    </form>

    <h2>1. Using Nested Eager Loading</h2>
    <table>
        <table>
            <thead>
                <tr>
                    <th>User Name</th>
                    <th>Car Model</th>
                    <th>Insurance Provider</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($users as $user)
                    <tr>
                        <td>{{ $user->name }}</td>
                        <td>{{ $user->car ? $user->car->model : 'No Car' }}</td>
                        <td>{{ $user->car && $user->car->insurance ? $user->car->insurance->provider : 'No Insurance' }}
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>


        <h2>2. Using Has Many Through</h2>
        <table>
            <thead>
                <tr>
                    <th>User Name</th>
                    <th>Insurance Providers</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($throughUsers as $user)
                    <tr>
                        <td>{{ $user->name }}</td>
                        <td>
                            @if ($user->insurancePolicies->isNotEmpty())
                                <ul>
                                    @foreach ($user->insurancePolicies as $policy)
                                        <li>{{ $policy->provider }}</li>
                                    @endforeach
                                </ul>
                            @else
                                No Insurance
                            @endif
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </table>




</body>

</html>
