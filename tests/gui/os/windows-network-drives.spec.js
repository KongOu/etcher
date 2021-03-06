/*
 * Copyright 2016 resin.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict'

const { readFile } = require('fs')
const os = require('os')
const cp = require('child_process')
const m = require('mochainon')
const { promisify } = require('util')

const { replaceWindowsNetworkDriveLetter } = require('../../../lib/gui/app/os/windows-network-drives')

const readFileAsync = promisify(readFile)

describe('Network drives on Windows', () => {
  before(async () => {
    this.osPlatformStub = m.sinon.stub(os, 'platform')
    this.osPlatformStub.returns('win32')
    const wmicOutput = await readFileAsync('tests/data/wmic-output.txt', { encoding: 'ucs2' })
    this.execFileStub = m.sinon.stub(cp, 'execFile')
    this.execFileStub.callsArgWith(3, null, wmicOutput)
  })

  it('should parse network drive mapping on Windows', async () => {
    m.chai.expect(await replaceWindowsNetworkDriveLetter('Z:\\some-folder\\some-file'))
      .to.equal('\\\\192.168.1.1\\Public\\some-folder\\some-file')
  })

  after(() => {
    this.osPlatformStub.restore()
    this.execFileStub.restore()
  })
})
