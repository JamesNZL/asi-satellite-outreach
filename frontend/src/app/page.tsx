'use client'

import { useEffect, useState, useRef } from 'react'
import { useFetch, CachePolicies } from 'use-http'

type Data = {
  light: ({
    gain: number;
    integration: number;
    lux: number;
  } | {
    raw: number;
  })[];
  gyro: {
    x: number;
    y: number;
    z: number;
  };
  accelerometer: {
    x: number;
    y: number;
    z: number;
  };
  magnetometer: {
    x: number;
    y: number;
    z: number;
  };
  power: {
    vbat: number;
    charging: 'charging' | ''
  };
  environment: {
    temperature: number;
    humidity: number;
    pressure: number;
  };
  air: {
    raw: number;
    index: number;
  };
  tick: number;
}

export default function Home() {
  const [reload, setReload] = useState(1)
  const reloadInterval = useRef<number | null>(null)

  const { error, data } = useFetch<Data>('http://192.168.4.1/data', {
    cachePolicy: CachePolicies.NO_CACHE,
    timeout: 1000,
  }, [reload])

  useEffect(() => {
    function reloadData() {
      setReload(previous => previous + 1)
    }

    reloadInterval.current = window.setInterval(reloadData, 500)

    return () => {
      if (reloadInterval.current) {
        window.clearInterval(reloadInterval.current)
      }
    }
  }, [setReload])

  useEffect(() => {
    if (error) {
      (reloadInterval.current) && window.clearInterval(reloadInterval.current)
    }
  }, [error])

  const [startTick, setStartTick] = useState(0)

  if ((startTick === 0) && (data?.tick)) {
    setStartTick(data.tick)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      <h1>ASI Outreach</h1>

      {error && 'Error!'}

      {data && (<>

        <h2>Light</h2>
        <table className='table-auto border border-black'>
          <tbody>
            <tr>
              <th>Gain</th>
              <th>Integration</th>
              <th>Lux</th>
            </tr>
            {data.light.map((lightData, index) => (
              !('raw' in lightData) &&
              <tr key={index}>
                <td>{lightData.gain}</td>
                <td>{lightData.integration}</td>
                <td>{lightData.lux}</td>
              </tr>
            ))
            }
          </tbody>
        </table>

        <h2>Gyroscope</h2>
        <table>
          <tbody>
            <tr>
              <th>x</th>
              <td>{data.gyro.x}</td>
            </tr>
            <tr>
              <th>y</th>
              <td>{data.gyro.y}</td>
            </tr>
            <tr>
              <th>z</th>
              <td>{data.gyro.z}</td>
            </tr>
          </tbody>
        </table>

        <h2>Accelerometer</h2>
        <table>
          <tbody>
            <tr>
              <th>x</th>
              <td>{data.accelerometer.x}</td>
            </tr>
            <tr>
              <th>y</th>
              <td>{data.accelerometer.y}</td>
            </tr>
            <tr>
              <th>z</th>
              <td>{data.accelerometer.z}</td>
            </tr>
          </tbody>
        </table>

        <h2>Magnetometer</h2>
        <table>
          <tbody>
            <tr>
              <th>x</th>
              <td>{data.magnetometer.x}</td>
            </tr>
            <tr>
              <th>y</th>
              <td>{data.magnetometer.y}</td>
            </tr>
            <tr>
              <th>z</th>
              <td>{data.magnetometer.z}</td>
            </tr>
          </tbody>
        </table>

        <h2>Power</h2>
        <table>
          <tbody>
            <tr>
              <th>Battery Voltage</th>
              <td>{data.power.vbat}</td>
            </tr>
            <tr>
              <th>Battery Status</th>
              <td>{data.power.charging}</td>
            </tr>
          </tbody>
        </table>

        <h2>Environment</h2>
        <table>
          <tbody>
            <tr>
              <th>Temperature</th>
              <td>{data.environment.temperature}</td>
            </tr>
            <tr>
              <th>Humidity</th>
              <td>{data.environment.humidity}</td>
            </tr>
            <tr>
              <th>Pressure</th>
              <td>{data.environment.pressure}</td>
            </tr>
          </tbody>
        </table>

        <h2>Air</h2>
        <table>
          <tbody>
            <tr>
              <th>Index</th>
              <td>{data.air.index}</td>
            </tr>
            <tr>
              <th>Raw</th>
              <td>{data.air.raw}</td>
            </tr>
          </tbody>
        </table>

        <h2>Absolute Tick</h2>
        <code>{data.tick}</code>

        <h2>Relative Tick</h2>
        <code>{data.tick - startTick}</code>

      </>)}
    </main>
  )
}
