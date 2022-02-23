<template>
  <div class="row-fluid text-left">
    <div>
      <div class="opblock-tag-section opblock-tag">
        Make a request to get started.
      </div>

      <h5 class="p10">cURL (POST)</h5>
      <pre class="prettyprint opblock opblock-summary">
curl -X POST -d "{ \"fizz\": \"buzz\" }" -H "Content-Type: application/json" \
  "{{ url }}"
  </pre>

      <h5 class="p10">cURL (GET)</h5>
      <pre class="prettyprint opblock opblock-summary">
curl -X GET -H "Content-Type: application/json" \
  "{{ url }}/{identifier}"
  </pre>

      <h5 class="p10">cURL (LIST)</h5>
      <pre class="prettyprint opblock opblock-summary">
curl -X GET -H "Content-Type: application/json" \
  "{{ url }}"
  </pre>

      <h5 class="p10">Python (with Requests)</h5>
      <pre class="prettyprint opblock opblock-summary">
import requests, time
r = requests.post('{{ url }}', data={"ts":time.time()})
print r.status_code
print r.content</pre
      >

      <h5 class="p10">Node.js (with request)</h5>
      <pre class="prettyprint opblock opblock-summary">
var request = require('request');
var url ='{{ url }}'
request(url, function (error, response, body) {
  if (!error) {
    console.log(body);
  }
});</pre
      >

      <h5 class="p10">Ruby</h5>
      <pre class="prettyprint opblock opblock-summary">
require 'open-uri'
result = open('{{ url }}')
result.lines { |f| f.each_line {|line| p line} }</pre
      >

      <h5 class="p10">C# / .NET</h5>
      <pre class="prettyprint opblock opblock-summary">
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace RequestBinExample
{
  class Program
  {
    static void Main(string[] args)
    {
      MakeRequest();
    }

    private static async Task MakeRequest()
    {
      var httpClient = new HttpClient();
      var response = await httpClient.GetAsync(new Uri("{{ url }}"));
      var body = await response.Content.ReadAsStringAsync();
      Console.WriteLine(body);
    }
  }
}</pre
      >

      <h5 class="p10">Java</h5>
      <pre class="prettyprint opblock opblock-summary">
import org.apache.commons.httpclient.*;
import org.apache.commons.httpclient.methods.*;
import org.apache.commons.httpclient.params.HttpMethodParams;

import java.io.*;

public class RequestBinTutorial {
  public static void main(String[] args) {
    HttpClient client = new HttpClient();
    GetMethod method = new GetMethod("{{ url }}");
    try {
      int statusCode = client.executeMethod(method);
      byte[] responseBody = method.getResponseBody();
      System.out.println(new String(responseBody));
    } catch (Exception e) {
      System.err.println("Fatal error: " + e.getMessage());
      e.printStackTrace();
    } finally {
      method.releaseConnection();
    }
  }
}</pre
      >

      <h5 class="p10">PHP</h5>
      <pre class="prettyprint opblock opblock-summary">
&lt;?php
    $result = file_get_contents('{{ url }}');
    echo $result;
?&gt;</pre
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    url: '',
  },
}
</script>

<style></style>
