local successCb
local failCb
local resultReceived = false

RegisterNUICallback('callback', function(data)
    SetNuiFocus(false, false)
    resultReceived = true
    if data.success then
        successCb()
    else
        failCb()
    end
end)

RegisterNUICallback("close", function()
    SetNuiFocus(false, false)
end)

RegisterCommand('swipe',function()
    exports["magni-cardswipe"]:cardswipe(
        function()
            print("success")
        end,
        function()
            print("fail")
    end)
end)

exports('cardswipe', function(success, fail)
    resultReceived = false
    successCb = success
    failCb = fail
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = "open"
    })
end)