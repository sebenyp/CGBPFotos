using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Diagnostics;
using System.IO;
using System.Threading;

namespace auto_img_functions
{
    class Program
    {
        static void Main(string[] args)
        {
            // Ordering images in all related folders
            var aaa = from dir in Directory.EnumerateDirectories(@".\cgm2\", "g_*")
                      select dir.Substring(dir.LastIndexOf('\\') + 1);

            foreach (var item in aaa)
            {
                OrderImageFilesInModule(item);
                ModifyHtmlInModule(item);
                Console.WriteLine();
            }

            //Wait for a keypress
            Console.ReadLine();
        }

        public static void OrderImageFilesInModule(string moduleName)
        {
            string folderName = moduleName;
            string ext = "jpg";
            string path = folderName + @"\images";

            // rename all to tmpxx.ext format, except for elso.ext
            var imageRenameList = (from file in Directory.EnumerateFiles(path, "*." + ext)
                                   select file).ToList();

            if (imageRenameList.Count > 0)
            {
                int tmpCount = 0;
                foreach (var item in imageRenameList)
                {
                    if (Path.GetFileNameWithoutExtension(item) != "elso")
                    {
                        File.Move(item, path + @"\tmp" + tmpCount + "." + ext);
                        tmpCount++;
                    }
                }
                var imageNameList = (from file in Directory.EnumerateFiles(path, "*." + ext)
                                     select Path.GetFileNameWithoutExtension(file)).ToArray();
                int imageCount = imageNameList.Length;
                Console.WriteLine(imageCount + " db kép a " + folderName + " mappában.");

                // for nicer file names
                folderName = folderName.Substring(2);


                int counterIndex = 0;
                // ha van elso, akkor az elejere kerul! A mappa rendezése bezavarhat? Létrehozás dátuma szerint rendezve?
                if (imageNameList[0] == "elso")
                {
                    File.Move(path + @"\elso." + ext, path + @"\bpf" + folderName + "01." + ext);
                    counterIndex++;
                    Console.WriteLine("Első file beállítva a " + moduleName + " mappában.");
                }
                else
                {
                    Console.WriteLine("Nincs első file a " + moduleName + " mappában.");
                }

                for (int i = counterIndex; i < imageNameList.Length; i++)
                {
                    if (i < 9)
                    {
                        File.Move(path + @"\" + imageNameList[i] + "." + ext, path + @"\bpf" + folderName + "0" + (i + 1) + "." + ext);
                    }
                    else
                    {
                        File.Move(path + @"\" + imageNameList[i] + "." + ext, path + @"\bpf" + folderName + (i + 1) + "." + ext);
                    }
                }
                Console.WriteLine("A file-ok rendezve a " + moduleName + " mappában.");
            }
            else
            {
                Console.WriteLine("Nincs kép a " + moduleName + " mappábna.");
            }
        }

        public static void ModifyHtmlInModule(string moduleName)
        {
            string folderName = moduleName;
            string path = folderName + @"\";
            var htmlFileName = (from file in Directory.EnumerateFiles(path, "*.html")
                                select Path.GetFileName(file)).ToArray()[0];
            string htmlFullPath = path + htmlFileName;

            // nem lenne elég csak a file műveleteket betenni egy-egy try block-ba?
            try
            {
                // Count the file lines
                StreamReader counterSR = new StreamReader(htmlFullPath);
                string counterLine = counterSR.ReadLine();
                int lineCount = 0;
                while (counterLine != null)
                {
                    lineCount++;
                    counterLine = counterSR.ReadLine();
                }
                counterSR.Close();

                // make the array
                List<string> lineList = new List<string>();

                // fill the array
                // nem lesz img tag a html ben, ha üres mappára futtatjuk, ha eután nem üres mappára futtatjuk, akkor a html végére teszi a képeket
                StreamReader dumperSR = new StreamReader(htmlFullPath);
                string dumperLine = dumperSR.ReadLine();
                int firstIndex = 0;
                bool first = false;
                int imgCount = 0;
                while (dumperLine != null)
                {
                    lineList.Add(dumperLine);
                    if (!first && dumperLine.Contains("img-thumbnail")) first = true;
                    if (!first) firstIndex++;
                    if (dumperLine.Contains("img-thumbnail")) imgCount++;
                    dumperLine = dumperSR.ReadLine();
                }
                dumperSR.Close();

                // If images folder is empty
                if (firstIndex == lineList.Count) firstIndex = 85; // hát ez így nagyon gáz, és instabil, és nem future proof

                // deleting unneccessary lines
                int removeFrom = firstIndex - 3;
                int removeTo = (firstIndex - 3) + (imgCount * 7);
                List<string> noImgLinesList = new List<string>();
                int i = 0;
                foreach (var item in lineList)
                {
                    if ((i < removeFrom) || (i >= removeTo))
                    {
                        noImgLinesList.Add(item);
                    }
                    i++;
                }

                //most kellene a képek alapján meghatározni a beírandó sorokat
                string ext = "jpg";
                string imgPath = path + @"images\";
                var imgsFullPathList = (from file in Directory.EnumerateFiles(imgPath, "*." + ext)
                                        select Path.GetFileNameWithoutExtension(file)).ToList();

                List<string> toAdd = new List<string>();
                int imgId = 0;
                foreach (var item in imgsFullPathList)
                {
                    toAdd.Add("                        <div class=\"col-xs-12 col-sm-6 col-md-4 col-lg-3\">");
                    toAdd.Add("                            <div class=\"thumbnail_container\">");
                    toAdd.Add("                                <a class=\"thumbnail\">");
                    toAdd.Add("                                    <img id=\"" + imgId + "\" class=\"img-thumbnail viewable btn\" src=\"./images/" + item + "." + ext + "\" />");
                    toAdd.Add("                                </a>");
                    toAdd.Add("                            </div>");
                    toAdd.Add("                        </div>");
                    imgId++;
                }

                // make the final list for writing it to file
                List<string> toWrite = new List<string>();
                int writeIndex = 0;
                foreach (var item in noImgLinesList)
                {
                    toWrite.Add(item);
                    writeIndex++;
                    if (writeIndex == removeFrom)
                    {
                        foreach (var item2 in toAdd)
                        {
                            toWrite.Add(item2);
                        }
                    }
                }

                // write the file
                StreamWriter sw = new StreamWriter(htmlFullPath);

                foreach (var item in toWrite)
                {
                    sw.WriteLine(item);
                }

                sw.Close();
                Console.WriteLine("Html file módosítva a " + moduleName + " könyvtárban.");
            }
            catch (Exception ex)
            {
                Console.WriteLine("Kivétel történt: " + ex.Message);
            }
        }
    }
}
